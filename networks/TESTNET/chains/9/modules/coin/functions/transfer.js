const senderPublicKey = '128c32eb3b4d99be6619aa421bc3df9ebc91bde7a4acf5e8eb9c27f553fa84f3';
const senderAccount = 'k:128c32eb3b4d99be6619aa421bc3df9ebc91bde7a4acf5e8eb9c27f553fa84f3';
const receiverAccount = 'k:affa4c351a7d7f5035508e5e9e13f1543d402ea8db6a3137de784508b17190ce';
const amount = { decimal: "1.0" }
const chainId = 1;
const network = 'testnet';
const networkId = 'testnet04';
const apiVersion = '0.0';
const api = 'https://api.' + network + '.chainweb.com/chainweb/' + apiVersion + '/' + networkId + '/chain/' + chainId + '/pact';

const {
    submit,
    pollStatus,
} = getClient(api);

const transaction = Pact.builder
  .execution(
      Pact.modules['coin'].transfer(senderAccount, receiverAccount, amount)
  )
  .addSigner(senderPublicKey, (withCap) => [
      withCap('coin.TRANSFER', senderAccount, receiverAccount, amount),
      withCap('coin.GAS'),
  ])
  .setMeta({ chainId: chainId.toString(), sender: senderAccount })
  .setNetworkId(networkId)
  .createTransaction();

async function main() {
    Logger.log(JSON.stringify(transaction, null, 3));
    const signedTransaction = await signWithChainweaver(transaction);

    Logger.log(JSON.stringify(signedTransaction, null, 3))

    if (!isSignedCommand(signedTransaction)) {
        Logger.log('Transaction was not signed.')
    }

    Logger.log('Submitting transaction.');
    const requestKeys = await submit(signedTransaction);
    Logger.log('Please wait, polling request status for request key: ' + requestKeys);
    const result = await pollStatus(requestKeys);
    Logger.log(JSON.stringify(result, null, 3));
};

main().catch(Logger.log);
