const senderPublicKey = '128c32eb3b4d99be6619aa421bc3df9ebc91bde7a4acf5e8eb9c27f553fa84f3';
const senderAccount = 'k:128c32eb3b4d99be6619aa421bc3df9ebc91bde7a4acf5e8eb9c27f553fa84f3';
const receiverAccount = 'k:affa4c351a7d7f5035508e5e9e13f1543d402ea8db6a3137de784508b17190ce';
const amount = { decimal: "1.0" }
const chainId = 1;
const network = 'testnet';
const networkId = 'testnet04';
const apiVersion = '0.0';
const api = 'https://api.' + network + '.chainweb.com/chainweb/' + apiVersion + '/' + networkId + '/chain/' + chainId + '/pact';

const transactionBuilder =
  Pact.modules['coin']
    .transfer(senderAccount, receiverAccount, amount)
    .addCap('coin.GAS', senderPublicKey)
    .addCap(
      'coin.TRANSFER',
      senderPublicKey,
      senderAccount,
      receiverAccount,
      amount,
    )
    .setMeta({
      sender: senderAccount,
    }, networkId);

(async function () {
    const signedTransaction = await signWithChainweaver(transactionBuilder)
    try {
        const response = await signedTransaction[0].send(api);
        const requestKey = response.requestKeys[0];

        Logger.log('Start polling status of request: ' + requestKey);

        pollSpvProof(requestKey, (chainId.toString()), api, {
            interval: 1000,
            timeout: 60000,
            onPoll: (status) => {
                Logger.log(status)
            }
        });
    } catch (error) {
        Logger.log(error.message);
    }
}())