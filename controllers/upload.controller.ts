import { PineconeClient } from '@pinecone-database/pinecone';
import { OpenAI } from 'langchain/llms';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PineconeStore } from 'langchain/vectorstores';
import dotenv from 'dotenv';
import { loadQAChain } from 'langchain/chains';
import { PDFLoader } from 'langchain/document_loaders';
import { DocxLoader } from 'langchain/document_loaders';
import User from '../models/users.model';
import Prompt from '../models/prompt.model';
import ChatHistory from '../models/chatHistory.model';
dotenv.config();

const basePath = 'uploads/';

function fileLoad(fileName) {
  //Determine file's extension
  const extensionName = fileName.split('.').filter(Boolean).slice(1).join('.');

  let loader;
  if (extensionName === 'pdf') {
    loader = new PDFLoader(basePath + fileName, {
      splitPages: false,
      pdfjs: () => import('pdf-parse/lib/pdf.js/v1.9.426/build/pdf.js'),
    });
  } else {
    loader = new DocxLoader(basePath + fileName);
  }

  return loader;
}

const validate_usage = async (email: string) => {
  const user = await User.findOne({ email: email });
  const billingValue = user.billing;
  const data = {
    code: 200,
    message: 'Success',
  };

  if (billingValue.value !== 0) {
    if (user.usage_tracking + 1 >= billingValue.value) {
      const data = {
        code: 201,
        message: 'Your chat usage is stopped. Please bill to use it.',
      };
      return data;
    }
  }

  user.usage_tracking++;
  await user.save();
  return data;
};

export const uploadFile = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.data });
    const totalValue = user.billing;
    if (totalValue.value !== 0) {
      if (totalValue.value === -1) {
        return res.json({ code: 201, message: 'Please bill before use.' });
      } else if (user.usage_tracking >= totalValue.value) {
        return res.json({
          code: 202,
          message: 'Please bill again. Your usage of tracking done',
        });
      }
    }
    res.json({ code: 200, data: req.file });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const train = async (req, res) => {
  try {
    if (!req.body.filename) {
      return res.status(404).json({ message: 'Parameter Error' });
    }
    const pinecone = new PineconeClient();
    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT ?? '',
      apiKey: process.env.PINECONE_API_KEY ?? '',
    });

    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    await pineconeIndex.delete1({
      deleteAll: true,
      namespace: req.body.email,
    });

    const loader = fileLoad(req.body.filename);

    const rawDocs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 0,
    });

    const docs = await textSplitter.splitDocuments([
      new Document({
        pageContent: rawDocs[0].pageContent,
      }),
    ]);

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: pineconeIndex,
      namespace: req.body.email,
    });
    res.send('File Embedding Success');
  } catch (error) {
    res.status(500).send(error);
  }
};

export const chatMessage = async (req, res) => {
  try {
    const value = await validate_usage(req.body.email);
    if (value.code === 201) {
      return res.status(value.code).json({ message: value.message });
    }

    const pinecone = new PineconeClient();

    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT ?? '', //this is in the dashboard
      apiKey: process.env.PINECONE_API_KEY ?? '',
    });

    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    /* create vectorstore*/
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
      {
        pineconeIndex: index,
        textKey: 'text',
        namespace: req.body.email,
      }
    );

    const llm = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0,
      modelName: 'text-davinci-003',
    });

    const results = await vectorStore.similaritySearch(req.body.value, 7);
    const chain = loadQAChain(llm, { type: 'stuff' });

    const result = chain
      .call({
        input_documents: results,
        question: req.body.value,
      })
      .then(async (row) => {
        const chatHistory = await ChatHistory.create({
          user_id: req.body.email,
          human_message: req.body.value,
          ai_message: row.text,
          date: new Date(),
        });
        await chatHistory.save();
        res.json(row);
      });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const summarize = async (req, res) => {
  try {
    const { email, fileName, question, prompt } = req.body;
    const value = await validate_usage(email);
    if (value.code === 201) {
      return res.status(value.code).json({ message: value.message });
    }

    const client = new PineconeClient();
    await client.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
    });
    const pineconeIndex = client.Index(process.env.PINECONE_INDEX_NAME);
    await pineconeIndex.delete1({
      deleteAll: true,
      namespace: email,
    });

    const loader = fileLoad(fileName);

    const rawDocs = await loader.load();
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 0,
    });

    const docs = await textSplitter.splitDocuments([
      new Document({
        pageContent: rawDocs[0].pageContent,
      }),
    ]);
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: pineconeIndex,
      namespace: email,
    });

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
      {
        pineconeIndex: pineconeIndex,
        textKey: 'text',
        namespace: email,
      }
    );

    const llm = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0,
    });
    const results = await vectorStore.similaritySearch(prompt, 5);
    const chain = loadQAChain(llm, { type: 'stuff' });

    const result = chain
      .call({
        input_documents: results,
        question: prompt,
      })
      .then(async (row) => {
        const chatHistory = await ChatHistory.create({
          user_id: email,
          human_message: question,
          ai_message: row.text,
          date: new Date(),
        });
        await chatHistory.save();
        res.json(row);
      });
  } catch (error) {
    res.status(404).send({ error: error });
  }
};

export const customizePrompt = async (req, res) => {
  try {
    const { index, value } = req.body;
    const prompt = await Prompt.find();
    if (prompt.length === 0) {
      const createPrompt = await Prompt.create({
        prompt: req.body.value,
      });
      await createPrompt.save();
    } else {
      prompt[0].prompt[index] = value;
      await prompt[0].save();
    }
    res
      .status(200)
      .send({ data: prompt[0].prompt, message: 'Prompt Change Success' });
  } catch (error) {
    res.status(404).send({ message: 'Something Went Wrong' });
  }
};

export const getPrompt = async (req, res) => {
  try {
    const prompt = await Prompt.find();
    res
      .status(200)
      .send({ data: prompt[0].prompt, message: 'Prompt Change Success' });
  } catch (error) {
    res.status(404).send({ message: 'Something Went Wrong' });
  }
};
