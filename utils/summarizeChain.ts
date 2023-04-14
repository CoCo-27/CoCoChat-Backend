import { OpenAI } from 'langchain/llms';
import { loadSummarizationChain } from 'langchain/chains';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PineconeClient } from '@pinecone-database/pinecone';
import { PineconeStore } from 'langchain/vectorstores';
import { OpenAIEmbeddings } from 'langchain/embeddings';

export const summarizeChain = async (email) => {
  console.log('Summarize FileName = ', email);
  const pinecone = new PineconeClient();
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT ?? '', //this is in the dashboard
    apiKey: process.env.PINECONE_API_KEY ?? '',
  });

  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
    {
      pineconeIndex: index,
      textKey: 'text',
      namespace: email,
    }
  );

  const model = new OpenAI({ temperature: 0 });
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([]);
  // const docList = vectorStore.asRetriever().getRelevantDocuments();

  // const docs = await textSplitter.createDocuments([text]);
  // This convenience function creates a document chain prompted to summarize a set of documents.
  const chain = loadSummarizationChain(model);
  const res = await chain.call({
    input_documents: docs,
  });
  return res;
};
