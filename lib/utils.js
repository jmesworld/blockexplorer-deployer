
const fs = require('fs/promises')
const path = require('path')
const glob = require('glob')
const Mustache = require("mustache")

let environnement = process.env.NETWORK || 'testnet'

const setEnvironnement = function(value){
  environnement = value
}
const initDirectory= async function (){
  const dest =  path.resolve(__dirname, `../out/${environnement}`)
  console.log({dest})
  const exists = await fs.stat(dest).catch(x=>false)
  if(!exists){
    await fs.mkdir(dest)
    await fs.mkdir(`${dest}/k8s/`)
    console.log(`${dest} created`)
  }
  return dest
}


const renderToFile = async function (file, view) {
  // const template = (await fs.readFile(path.resolve(__dirname,`../templates/01_common-config-${template}-template.yaml`))).toString()
  const template = (await fs.readFile(path.resolve(__dirname, `../templates/${file}.yaml`))).toString()
  const yaml = Mustache.render(template, view)
  await fs.writeFile(path.resolve(__dirname, `../out/${environnement}/k8s/${file}.yaml`), yaml)
}

const renderGenesis = async function (genesis_file) {
  const genesis = (await fs.readFile(genesis_file)).toString()
  await renderToFile('genesis-configmap', { genesis: genesis.split('\n') })
}

const renderBootnode = async function (enode, ip) {
  await renderToFile('bootpeers-configmap', { enode,ip })
}


const renderConfig = async function(genesis, enode, ip){
  await renderGenesis(genesis)
  await renderBootnode(enode, ip)

  await renderToFile("blockscout-deployment",  {})
  await renderToFile("blockscout-ingress",  {})
  await renderToFile("blockscout-service",  {})
  await renderToFile("db-deployment",  {})
  await renderToFile("db-service",  {})
  await renderToFile("db-data-2-persistentvolumeclaim",  {})
  await renderToFile("ethconf-configmap",  {})
  await renderToFile("jmes-data-current-persistentvolumeclaim",  {})
  await renderToFile("jmes-node-deployment",  {})
  await renderToFile("jmes-node-service",  {})

}

module.exports= {setEnvironnement, renderConfig, initDirectory}

