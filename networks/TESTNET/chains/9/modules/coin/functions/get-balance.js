const account = 'k:128c32eb3b4d99be6619aa421bc3df9ebc91bde7a4acf5e8eb9c27f553fa84f3';
const chainId = '1';
const network = 'testnet';
const networkId = 'testnet04';
const apiVersion = '0.0';
const api = 'https://api.' + network + '.chainweb.com/chainweb/' + apiVersion + '/' + networkId + '/chain/' + chainId + '/pact';

const {
  local,
} = getClient(api);

async function getBalance(account) {
  const transaction = Pact.builder
    .execution(Pact.modules.coin['get-balance'](account))
    .setMeta({ chainId })
    .setNetworkId(networkId)
    .createTransaction();

  const response = await local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  Logger.log(JSON.stringify(response, null, 3));
}

getBalance(account).catch(Logger.log);
