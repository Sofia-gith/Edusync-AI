// database/test-db.ts
import database from './index';
import Embedding from './models/Embedding';

export async function testInsertEmbedding() {
  console.log('🧪 Testando inserção de embedding...\n');

  try {
    const embeddingsCollection = database.get<Embedding>('embeddings');

    // Inserir embedding de teste
    const testEmbedding = await database.write(async () => {
      return await embeddingsCollection.create((embedding) => {
        embedding.vector = JSON.stringify(
          Array(384).fill(0).map(() => Math.random())
        );
        embedding.content = 'Para ensinar subtração com zero, use a metáfora da "cadeira vazia".';
        embedding.source = 'Manual de Matemática';
        embedding.chapter = 'Subtração';
        embedding.page = 45;
        embedding.metadata = JSON.stringify({ topic: 'arithmetic' });
      });
    });

    console.log('✅ Embedding criado:');
    console.log(`   ID: ${testEmbedding.id}`);
    console.log(`   Content: ${testEmbedding.content.slice(0, 50)}...`);
    console.log(`   Source: ${testEmbedding.source}`);

    // Buscar todos os embeddings
    const allEmbeddings = await embeddingsCollection.query().fetch();
    console.log(`\n📊 Total de embeddings: ${allEmbeddings.length}`);

    return testEmbedding;
  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  }
}

export async function testQueryEmbeddings() {
  console.log(' Testando busca de embeddings...\n');

  try {
    const embeddingsCollection = database.get<Embedding>('embeddings');

    // Buscar por source
    const mathEmbeddings = await embeddingsCollection
      .query()
      .where('source', 'Manual de Matemática')
      .fetch();

    console.log(`✅ Encontrados ${mathEmbeddings.length} embeddings de Matemática`);

    mathEmbeddings.forEach((emb, i) => {
      console.log(`\n${i + 1}. ${emb.content.slice(0, 60)}...`);
      console.log(`   Chapter: ${emb.chapter}`);
      console.log(`   Page: ${emb.page}`);
    });

    return mathEmbeddings;
  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  }
}

export async function testClearDatabase() {
  console.log('🗑️  Limpando banco de dados...\n');

  try {
    await database.write(async () => {
      const embeddingsCollection = database.get<Embedding>('embeddings');
      const allEmbeddings = await embeddingsCollection.query().fetch();

      await Promise.all(
        allEmbeddings.map((emb) => emb.markAsDeleted())
      );
    });

    console.log('✅ Banco limpo!');
  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  }
}