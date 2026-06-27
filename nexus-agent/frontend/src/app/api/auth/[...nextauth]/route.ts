import NextAuth, { DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';
import { SiweMessage } from 'siwe';

declare module "next-auth" {
  interface Session {
    user: {
      address?: string;
      id?: string;
    } & DefaultSession["user"]
  }
}

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: { label: 'Message', type: 'text' },
        signature: { label: 'Signature', type: 'text' },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || '{}'));
          const result = await siwe.verify({ signature: credentials?.signature || '' });
          
          if (result.success) {
            const address = siwe.address.toLowerCase();
            
            // Upsert user in Supabase
            const { data: user } = await getSupabase()
              .from('users')
              .upsert({ wallet_address: address }, { onConflict: 'wallet_address' })
              .select()
              .single();
            
            return { id: user?.id, address, name: `${address.slice(0,6)}...${address.slice(-4)}` };
          }
          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { 
        token.address = (user as any).address; 
        token.userId = user.id; 
      }
      return token;
    },
    async session({ session, token }) {
      session.user = { ...session.user, address: token.address as string, id: token.userId as string };
      return session;
    },
  },
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: '/?auth=required' },
});

export { handler as GET, handler as POST };
