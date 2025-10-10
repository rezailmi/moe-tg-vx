import pg from 'pg'
const { Client } = pg

const connectionString = 'postgres://postgres.uzrzyapgxseqqisapmzb:ob5VlizdFjyam3fw@aws-1-us-east-1.pooler.supabase.com:5432/postgres'

async function applyPolicy() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  })

  try {
    console.log('🔐 Connecting to database...')
    await client.connect()
    console.log('✅ Connected\n')

    console.log('📝 Dropping existing policy if it exists...')

    try {
      await client.query(`
        DROP POLICY IF EXISTS "DEV: Public read student_private_notes" ON student_private_notes;
      `)
      console.log('✅ Dropped existing policy (or it didn\'t exist)\n')
    } catch (e) {
      console.log('⚠️  No existing policy to drop\n')
    }

    console.log('📝 Creating new RLS policy for student_private_notes...')

    const policySQL = `
      CREATE POLICY "DEV: Public read student_private_notes"
        ON student_private_notes FOR SELECT
        TO anon, authenticated
        USING (true);
    `

    await client.query(policySQL)

    console.log('✅ Policy created successfully!\n')

    // Verify it works
    console.log('🧪 Testing policy...')
    const testQuery = `
      SELECT COUNT(*)
      FROM student_private_notes
      WHERE student_id = '7ab2d69d-f167-4ba9-9b4c-5190b4f466e5';
    `

    const result = await client.query(testQuery)
    console.log(`✅ Found ${result.rows[0].count} private note(s) for Tan Wei Jie\n`)

  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await client.end()
    console.log('👋 Connection closed')
  }
}

applyPolicy()
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error.message)
    process.exit(1)
  })
