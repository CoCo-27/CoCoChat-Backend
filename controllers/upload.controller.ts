import { PineconeClient } from '@pinecone-database/pinecone';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PineconeStore } from 'langchain/vectorstores';
import { DEFAULT_SYSTEM_PROMPT } from '../config/constant';
import { summarizeChain } from '../utils/summarizeChain';
import dotenv from 'dotenv';
import { CustomPDFLoader } from '../utils/customPDFLoader';
import { makeChain } from '../utils/makechain';
import Prompt from '../models/prompt.model';
dotenv.config();

const basePath = 'uploads/';

export const uploadFile = async (req, res) => {
  try {
    res.status(200).send(req.file);
  } catch (error) {
    res.status(404).json({ error });
  }
};

export const train = async (req, res) => {
  try {
    console.log('Train = ', req.body);
    if (!req.body.filename) {
      return res.status(404).json({ message: 'Parameter Error' });
    }
    const pinecone = new PineconeClient();
    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT ?? '',
      apiKey: process.env.PINECONE_API_KEY ?? '',
    });

    const loader = new CustomPDFLoader(basePath + req.body.filename);
    const rawDocs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 4000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);
    console.log('Docs = ', docs);

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    // await pineconeIndex.delete1({
    //   deleteAll: true,
    //   namespace: process.env.PINECONE_NAME_SPACE ?? '',
    // });

    const chunkSize = 50;

    for (let i = 0; i < docs.length; i += chunkSize) {
      const chunk = docs.slice(i, i + chunkSize);
      console.log('chunk', i, chunk);
      await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex: pineconeIndex,
        namespace: req.body.email,
      });
      console.log(Math.ceil((100 * i) / docs.length));
    }
    res.send('File Embedding Success');
  } catch (error) {
    console.log('error', error);
    res.status(500).send(error);
  }
};

export const chatMessage = async (req, res) => {
  try {
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

    const chain = makeChain(vectorStore);

    const result = await chain.call({
      question: req.body.value,
      chat_history: [],
    });
    console.log('result= ', result);
    res.status(200).json(result);
  } catch (error) {}
};

export const summarize = async (req, res) => {
  try {
    console.log('Summarize = ', req.body.email);
    const result = await summarizeChain(req.body.email);
    console.log('Result = ', result);
    res.status(200).send(result);
  } catch (error) {
    console.log('Summarize Error = ', error);
  }
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
