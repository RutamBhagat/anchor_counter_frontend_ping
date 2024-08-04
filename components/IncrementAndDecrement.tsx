import * as anchor from "@project-serum/anchor";

import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { FC, useCallback, useEffect, useState } from "react";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";

import idl from "../idl.json";

const PROGRAM_ID = `Fz9gqxzatYyEvKGXxQ55jq1mKfjnJoj9VxKwMqYm4MVZ`;

export interface Props {
  counter;
  setTransactionUrl;
}

export const IncrementAndDecrement: FC<Props> = ({
  counter,
  setTransactionUrl,
}) => {
  const [count, setCount] = useState(0);
  const [program, setProgram] = useState<anchor.Program>();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  useEffect(() => {
    let provider: anchor.Provider;

    try {
      provider = anchor.getProvider();
    } catch (error) {
      provider = new anchor.AnchorProvider(connection, wallet, {});
      anchor.setProvider(provider);
    }

    const program = new anchor.Program(idl as anchor.Idl, PROGRAM_ID);
    setProgram(program);
    refreshCount(program);
  }, []);

  const incrementCount = async () => {
    const sig = await program.methods
      .increment()
      .accounts({
        counter: counter,
        user: wallet.publicKey,
      })
      .rpc();

    setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
  };

  const decrementCount = async () => {
    const sig = await program.methods
      .decrement()
      .accounts({
        counter: counter,
        user: wallet.publicKey,
      })
      .rpc();

    setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
  };

  const refreshCount = async (program) => {
    const counterAccount = await program.account.counter.fetch(counter);
    setCount(counterAccount.count.toNumber());
  };

  return (
    <VStack>
      <HStack>
        <Button onClick={incrementCount}>Increment Counter</Button>
        <Button onClick={decrementCount}>Decrement Counter</Button>
        <Button onClick={() => refreshCount(program)}>Refresh count</Button>
      </HStack>
      <Text color="white">Count: {count}</Text>
    </VStack>
  );
};
