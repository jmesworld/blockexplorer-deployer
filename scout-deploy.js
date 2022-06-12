const utils = require('./lib/utils')
const { Command } = require('commander');

const program = new Command();

program
  .version('0.0.1')
  .option('-e, --env <env>', 'environnement name', 'local')
  .requiredOption('-g, --genesis <genesis>', 'Genesis file')
  .requiredOption('-b, --bootstrap <ip>', 'Bootstrap node ip')
  .requiredOption('-k, --enode <ip>', 'Bootstrap enode key')
  
program
  .command("setup")  
  .action(buildConfig)


program.parse(process.argv)

 async function buildConfig(){
    const options = program.opts()
    await utils.setEnvironnement(options.env)
    //console.log(options)
    await utils.initDirectory()
    await utils.renderConfig(options.genesis, options.enode, options.bootstrap)

 }