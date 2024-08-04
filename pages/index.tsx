import { Box, Button, Spacer, Stack, Text, VStack } from "@chakra-ui/react";

import { AppBar } from "../components/AppBar";
import Head from "next/head";
import { IncrementAndDecrement } from "../components/IncrementAndDecrement";
import { Initialize } from "../components/Initialize";
import { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

const Home: NextPage = (props) => {
  const [counter, setCounter] = useState("");
  const [transactionUrl, setTransactionUrl] = useState("");
  const wallet = useWallet();

  return (
    <div className={styles.App}>
      <Head>
        <title>Anchor Frontend Example</title>
      </Head>
      <Box h="calc(100vh)" w="full">
        <Stack w="full" h="calc(100vh)" justify="center">
          <AppBar />
          <div className={styles.AppBody}>
            {wallet.connected ? (
              counter ? (
                <VStack>
                  <IncrementAndDecrement
                    counter={counter}
                    setTransactionUrl={setTransactionUrl}
                  />
                </VStack>
              ) : (
                <Initialize
                  setCounter={setCounter}
                  setTransactionUrl={setTransactionUrl}
                />
              )
            ) : (
              <Text color="white">Connect Wallet</Text>
            )}
            <Spacer />
            {transactionUrl && (
              <a href={transactionUrl}>
                <Button margin={8}>View most recent transaction</Button>
              </a>
            )}
          </div>
        </Stack>
      </Box>
    </div>
  );
};

export default Home;
