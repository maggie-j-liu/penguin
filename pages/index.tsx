import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import PageLayout from "../components/PageLayout";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Component() {
  const { data: session, status } = useSession();
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="px-4 py-12">
        <h1 className="text-center text-6xl font-bold">🐧 Penguin</h1>
        <p className="text-2xl text-gray-800">
          Hackathon management made easy.
        </p>
        <div className="mx-auto mt-4 flex w-full justify-center">
          <button
            className="rounded-lg border-4 border-black bg-black px-6 py-2 text-3xl font-semibold text-white hover:bg-white hover:text-black"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              signIn("google");
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
