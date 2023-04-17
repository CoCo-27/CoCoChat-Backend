import { OpenAI } from 'langchain/llms';
import { loadSummarizationChain } from 'langchain/chains';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { CustomPDFLoader } from './customPDFLoader';

const basePath = 'uploads/';

export const summarizeChain = async (email) => {
  const prompt = 'promt'
  const loader = new CustomPDFLoader(basePath + email);
  const rawDocs = await loader.load();
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 4000,
    chunkOverlap: 200,
  });

  const docs = await textSplitter.splitDocuments(rawDocs);
  console.log('Docs = ', docs);

  const model = new OpenAI({ temperature: 0 });

  // This convenience function creates a document chain prompted to summarize a set of documents.
  const chain = loadSummarizationChain(model);
  const res = await chain.call({
    input_documents: docs,
  });
  return res;
};
