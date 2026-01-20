import { Q } from '@nozbe/watermelondb';
import database from './index';
import Embedding from './models/Embedding';
import SyncMetadata from './models/SyncMetadata';

/**
 * Teste 1: Inserir embedding de teste
 */
export async function testInsertEmbedding() {
  console.log('🧪 Testando inserção de embedding...\n');

  try {
    const embeddingsCollection = database.get<Embedding>('embeddings');

    // Inserir embedding de teste
    const testEmbedding = await database.write(async () => {
      return await embeddingsCollection.create((embedding) => {
        embedding.vector = JSON.stringify(
          Array(384).fill(0).map(() => Math.random() * 2 - 1)
        );
        embedding.content =
          'Para ensinar subtração com zero, use a metáfora da "cadeira vazia". Explique que o zero é como uma cadeira sem ninguém sentado.';
        embedding.source = 'Manual de Matemática - 4º ano';
        embedding.chapter = 'Subtração';
        embedding.page = 45;
        embedding.metadata = JSON.stringify({
          topic: 'arithmetic',
          difficulty: 'intermediate',
        });
      });
    });

    console.log('✅ Embedding criado com sucesso!');
    console.log(`   ID: ${testEmbedding.id}`);
    console.log(`   Content: ${testEmbedding.content.slice(0, 60)}...`);
    console.log(`   Source: ${testEmbedding.source}`);
    console.log(`   Chapter: ${testEmbedding.chapter}`);
    console.log(`   Page: ${testEmbedding.page}`);

    // Buscar todos os embeddings
    const allEmbeddings = await embeddingsCollection.query().fetch();
    console.log(`\n📊 Total de embeddings no banco: ${allEmbeddings.length}`);

    return testEmbedding;
  } catch (error) {
    console.error('❌ Erro ao inserir embedding:', error);
    throw error;
  }
}

/**
 * Teste 2: Buscar embeddings por filtro
 */
export async function testQueryEmbeddings() {
  console.log('🔍 Testando busca de embeddings...\n');

  try {
    const embeddingsCollection = database.get<Embedding>('embeddings');

    // Buscar todos
    const allEmbeddings = await embeddingsCollection.query().fetch();
    console.log(`📚 Total: ${allEmbeddings.length} embeddings\n`);

    // Buscar por source
    const mathEmbeddings = await embeddingsCollection
      .query(Q.where('source', 'Manual de Matemática - 4º ano'))
      .fetch();

    console.log(
      `✅ Encontrados ${mathEmbeddings.length} embeddings de Matemática:\n`
    );

    mathEmbeddings.forEach((emb, i) => {
      console.log(`${i + 1}. ${emb.content.slice(0, 60)}...`);
      console.log(`   Chapter: ${emb.chapter}`);
      console.log(`   Page: ${emb.page}`);
      console.log(`   Created: ${emb.createdAt.toLocaleString()}\n`);
    });

    return mathEmbeddings;
  } catch (error) {
    console.error('❌ Erro ao buscar embeddings:', error);
    throw error;
  }
}

/**
 * Teste 3: Inserir múltiplos embeddings (batch)
 */
export async function testBatchInsert() {
  console.log('📦 Testando inserção em batch...\n');

  const testData = [
    {
      content:
        'Estratégias para turmas multisseriadas: divida a turma em grupos por nível.',
      source: 'Manual de Gestão de Sala',
      chapter: 'Turmas Multisseriadas',
      page: 12,
    },
    {
      content:
        'Use atividades lúdicas para engajar alunos com dificuldade de concentração.',
      source: 'Guia de Metodologias Ativas',
      chapter: 'Jogos Pedagógicos',
      page: 34,
    },
    {
      content:
        'Para alfabetização, comece com palavras do cotidiano do aluno.',
      source: 'Manual de Alfabetização',
      chapter: 'Métodos de Alfabetização',
      page: 8,
    },
  ];

  try {
    await database.write(async () => {
      const embeddingsCollection = database.get<Embedding>('embeddings');

      const newRecords = testData.map((data) =>
        embeddingsCollection.prepareCreate((record) => {
          record.vector = JSON.stringify(
            Array(384)
              .fill(0)
              .map(() => Math.random() * 2 - 1)
          );
          record.content = data.content;
          record.source = data.source;
          record.chapter = data.chapter;
          record.page = data.page;
        })
      );

      await database.batch(...newRecords);
    });

    console.log(`✅ ${testData.length} embeddings inseridos em batch!`);

    // Contar total
    const embeddingsCollection = database.get<Embedding>('embeddings');
    const count = await embeddingsCollection.query().fetchCount();
    console.log(`📊 Total no banco: ${count} embeddings\n`);
  } catch (error) {
    console.error('❌ Erro no batch insert:', error);
    throw error;
  }
}

/**
 * Teste 4: Atualizar embedding
 */
export async function testUpdateEmbedding() {
  console.log('✏️  Testando atualização de embedding...\n');

  try {
    const embeddingsCollection = database.get<Embedding>('embeddings');
    const embeddings = await embeddingsCollection.query().fetch();

    if (embeddings.length === 0) {
      console.log('⚠️  Nenhum embedding para atualizar. Execute testInsertEmbedding() primeiro.');
      return;
    }

    const firstEmbedding = embeddings[0];
    console.log(`📝 Atualizando embedding ${firstEmbedding.id}...`);
    console.log(`   Antes: ${firstEmbedding.content.slice(0, 50)}...`);

    await database.write(async () => {
      await firstEmbedding.update((record) => {
        record.content =
          record.content + ' [ATUALIZADO - ' + new Date().toISOString() + ']';
      });
    });

    console.log(`   Depois: ${firstEmbedding.content.slice(0, 60)}...`);
    console.log('✅ Embedding atualizado!\n');
  } catch (error) {
    console.error('❌ Erro ao atualizar:', error);
    throw error;
  }
}

/**
 * Teste 5: Deletar embedding
 */
export async function testDeleteEmbedding() {
  console.log('🗑️  Testando deleção de embedding...\n');

  try {
    const embeddingsCollection = database.get<Embedding>('embeddings');
    const embeddings = await embeddingsCollection.query().fetch();

    if (embeddings.length === 0) {
      console.log('⚠️  Nenhum embedding para deletar.');
      return;
    }

    const toDelete = embeddings[embeddings.length - 1];
    console.log(`Deletando: ${toDelete.content.slice(0, 50)}...`);

    await database.write(async () => {
      await toDelete.markAsDeleted();
    });

    const countAfter = await embeddingsCollection.query().fetchCount();
    console.log(`✅ Embedding deletado!`);
    console.log(`📊 Restam ${countAfter} embeddings no banco\n`);
  } catch (error) {
    console.error('❌ Erro ao deletar:', error);
    throw error;
  }
}

/**
 * Teste 6: Limpar todo o banco
 */
export async function testClearDatabase() {
  console.log('🗑️  Limpando banco de dados...\n');

  try {
    await database.write(async () => {
      const embeddingsCollection = database.get<Embedding>('embeddings');
      const allEmbeddings = await embeddingsCollection.query().fetch();

      await Promise.all(allEmbeddings.map((emb) => emb.markAsDeleted()));
    });

    const count = await database.get<Embedding>('embeddings').query().fetchCount();
    console.log(`✅ Banco limpo! Restam ${count} embeddings\n`);
  } catch (error) {
    console.error('❌ Erro ao limpar banco:', error);
    throw error;
  }
}

/**
 * Teste 7: Testar SyncMetadata
 */
export async function testSyncMetadata() {
  console.log('🔄 Testando SyncMetadata...\n');

  try {
    const metadataCollection = database.get<SyncMetadata>('sync_metadata');

    // Criar metadata
    const metadata = await database.write(async () => {
      return await metadataCollection.create((record) => {
        record.key = 'last_sync';
        record.value = 'embeddings';
        record.version = '1.0.0';
        record.lastSynced = Date.now();
      });
    });

    console.log('✅ SyncMetadata criado:');
    console.log(`   Key: ${metadata.key}`);
    console.log(`   Value: ${metadata.value}`);
    console.log(`   Version: ${metadata.version}`);
    console.log(`   Last Synced: ${new Date(metadata.lastSynced).toLocaleString()}\n`);

    return metadata;
  } catch (error) {
    console.error('❌ Erro ao testar SyncMetadata:', error);
    throw error;
  }
}

/**
 * Executar todos os testes
 */
export async function runAllTests() {
  console.log('\n🧪 ========================================');
  console.log('   EXECUTANDO TODOS OS TESTES');
  console.log('========================================\n');

  try {
    await testClearDatabase();
    await testInsertEmbedding();
    await testQueryEmbeddings();
    await testBatchInsert();
    await testUpdateEmbedding();
    await testDeleteEmbedding();
    await testSyncMetadata();

    console.log('✅ ========================================');
    console.log('   TODOS OS TESTES PASSARAM!');
    console.log('========================================\n');
  } catch (error) {
    console.error('\n❌ ========================================');
    console.error('   TESTES FALHARAM!');
    console.error('========================================\n');
    throw error;
  }
}