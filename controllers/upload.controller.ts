import { PineconeClient } from '@pinecone-database/pinecone';
import { OpenAI } from 'langchain/llms';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PineconeStore } from 'langchain/vectorstores';
import { summarizeChain } from '../utils/summarizeChain';
import dotenv from 'dotenv';
import { CustomPDFLoader } from '../utils/customPDFLoader';
import { makeChain } from '../utils/makechain';
import { loadQAChain } from 'langchain/chains';
import { PDFLoader } from 'langchain/document_loaders';
import { DocxLoader } from 'langchain/document_loaders';
import Prompt from '../models/prompt.model';
dotenv.config();

const basePath = 'uploads/';

function fileLoad(fileName) {
  //Determine file's extension
  const extensionName = fileName.split('.').filter(Boolean).slice(1).join('.');
  console.log('EXT------------', extensionName);

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

export const uploadFile = async (req, res) => {
  const data = req;
  try {
    console.log('Upload Controller = ', req.file);
    res.status(200).send(req.file);
  } catch (error) {
    console.log('error = ', error);
    res.status(404).json({ error });
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
    console.log('error', error);
    res.status(500).send(error);
  }
};

export const chatMessage = async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body.email) {
      return res.status(404).json({ message: 'Please log in again' });
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
    });
    const results = await vectorStore.similaritySearch(req.body.value, 5);
    console.log('results---------', results);
    const chain = loadQAChain(llm, { type: 'stuff' });

    const result = chain
      .call({
        input_documents: results,
        question: req.body.value,
      })
      .then((row) => {
        res.json(row);
      });

    // const chain = makeChain(vectorStore);

    // const result = await chain.call({
    //   question: req.body.value,
    //   chat_history: [],
    // });
    // console.log('result= ', result);
    // res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const summarize = async (req, res) => {
  try {
    const client = new PineconeClient();
    await client.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
    });
    const pineconeIndex = client.Index(process.env.PINECONE_INDEX_NAME);
    await pineconeIndex.delete1({
      deleteAll: true,
      namespace: req.body.email,
    });

    console.log('======================OPEN', process.env.OPENAI_API_KEY);
    console.log('======================INDEX', process.env.PINECONE_INDEX_NAME);
    console.log('======================OPEN', process.env.OPENAI_API_KEY);
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

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
      {
        pineconeIndex: pineconeIndex,
        textKey: 'text',
        namespace: req.body.email,
      }
    );

    const llm = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0,
    });
    const results = await vectorStore.similaritySearch(req.body.prompt, 5);
    console.log('results!!!!!!! = ', results);
    const chain = loadQAChain(llm, { type: 'stuff' });

    const result = chain
      .call({
        input_documents: results,
        question: req.body.prompt,
      })
      .then((row) => {
        res.json(row);
      });
  } catch (error) {
    console.log('Summarize Error = ', error);
    res.status(404).send({ error: error });
  }
  // try {
  //   const result = await summarizeChain(
  //     req.body.email,
  //     req.body.prompt,
  //     req.body.filename
  //   );
  //   res.status(200).send(result);
  // } catch (error) {
  //   console.log('Summarize Error = ', error);
  //   res.status(404).send({ error: error });
  // }
};

export const customizePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.find();
    console.log('Database = ', prompt);
    if (prompt.length === 0) {
      const createPrompt = await Prompt.create({
        prompt: req.body.value,
      });
      await createPrompt.save();
    } else {
      prompt[0].prompt = req.body.value;
      await prompt[0].save();
    }
    res
      .status(200)
      .send({ data: req.body.value, message: 'Prompt Change Success' });
  } catch (error) {
    console.log('Prompt error = ', error);
    res.status(404).send({ message: 'Something Went Wrong' });
  }
};

export const getPrompt = async (req, res) => {
  try {
    const prompt = await Prompt.find();
    console.log('Database = ', prompt);
    res
      .status(200)
      .send({ data: prompt[0].prompt, message: 'Prompt Change Success' });
  } catch (error) {
    console.log('Prompt error = ', error);
    res.status(404).send({ message: 'Something Went Wrong' });
  }
};
