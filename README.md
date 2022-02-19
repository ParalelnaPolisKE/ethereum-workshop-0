# Tvorba a používanie Ethereum smart kontraktov

Privátny workshop zameraný na naučenie sa základov tvorby a práce so smart kontraktami pre sieť Ethereum písaných v programovacom jazyku Solidity.

Video z livestreamu si môžete pozrieť na YouTube kanále Paralelnej Polis Košice: https://youtu.be/VeXpKgFzO-4.

## Ethereum

Ethereum je verejná platforma s otvoreným zdrojovým kódom, distribuovaná a založená na technológii blockchain, ktorá umožňuje spúšťať aplikácie bez cenzúry alebo zásahov tretích strán.

Smart kontrakty sú vlastne programy, ktoré je možné spúštať na sieti Ethereum (prípadne ďalších blockchainoch, ktoré podporujú smart kontrakty). Koncept bol vytvorený Nickom Szabom v roku 1996.

Ethereum Virtual Machine alebo EVM je prostredie pre beh smart kontraktov v Ethereu. Je nielen sandboxovaný, ale v skutočnosti úplne izolovaný, čo znamená, že kód bežiaci v EVM nemá prístup k sieti, súborovému systému ani k iným procesom. Smart kontrakty majú taktiež obmedzený prístup k iným smart kontraktom.

## ERC štandardy

Ethereum Request for Comments (ERC) je dokument, ktorý píšu programátori smart kontraktov využívajúci platformu blockchain Ethereum. V týchto dokumentoch opisujú pravidlá, ktoré musia tokeny založené na technológii Ethereum spĺňať.

Ako celý proces funguje:
Developeri submitnú proposal ERC štandardu ako Ethereum Improvement Proposal (EIP)
Ethereum komunita hodnotí proposal a vyjadrí / komentuje ho
Tento proces pokračuje kým sa komunita neprikloní k rozhodnutiu acceptnúť alebo declinnúť proposal
Po acceptnutí developeri implementujú ERC štandard

## Programovanie smart kontraktov

### Nastavenie developerského prostredia

Na začiatok je potrebné nainštalovať si [Node.js](https://nodejs.org/en/about/). Odporúčam robiť to cez Node Version Manager (NVM). Ten si potrebujete nainštalovať pomocou návodu z nasledujúcich linkov:

- Windows: https://github.com/coreybutler/nvm-windows
- Linux/Mac: https://github.com/nvm-sh/nvm

Pre prácu so smart kontraktami budeme používať nástroj s názvom Truffle. V tomto repozitári je už Truffle projekt vytvorený a pripravený na použitie. Stačí si teda repozitár naklónovať a nainštalovať všetky závislosti (dependencies):

    git clone ...
    cd ...
    npm install

Ak by sme začínali úplne od začiatku, je potrebné urobiť nasledujúce kroky:

1. Cez terminál v Linuxe/Macu, resp. cmd.exe na Windowse, v čislo novej zložke, ktorú si najprv vytvoríte a nejak ju pomenujete, si vytvoríte nový Node.js projekt:

    npm init -y

2. Nainštalujete si Truffle

    npm install --save-dev truffle

3. Zinicializujete nový Truffle projekt, ktorý vytvorí všetky potrebné zložky a súbory s nastaveniami pre vás:

    npx truffle init

### Deployment kontraktu a interakcia s ním

Na začiatok chceme kontrakt vyskúšať na lokálnej verzii testovacieho Ethereum chainu. Na to je super použť nástroj Ganache. Stiahnite si ho, nainštalujte a spustite. Po spustení by ste mali vidieť niečo takéto:

...img...

Pre tento workshop nám bude stačiť kliknúť na __Quickstart__.

Spustí sa testovací, lokálny chain, hostovaný pre nás na adrese HTTP://127.0.0.1:7545.

IP alebo hostname spolu s portom treba zapísať do truffle-config.js do časti `network.development`:

```javascript
module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",     // Localhost 
            port: 7545,            // Ethereum port 
            network_id: "*",       // Any network 
        },
    },
    // ...
}
```

Skúsime deploynúť `Box` kontrakt na tento chain. Potrebujeme na to vytvoriť migračný skript (podobne ako sa to robí pri migrácii databáz) -> v priečinku `migrations` vytvoríme súbor `2_deploy.js`

V temrináli spustíme deployment pomocou migračného skriptu, ktorý spraví migrácie:

    npx truffle migrate --network development

Je to zo začiatku úplne nedotknutý chain. Najprv sa teda musí deploynúť aj `Migrations` kontrakt (vykonáva migrácie), následne sa deployne náš `Box` kontrakt.

Ak chceme vyskúšať interagovať s deploynnutým kontraktom, môžeme na to využiť Truffle konzolu:

    npx truffle console --network development

V tejto konzole si zavoláme deploynutý kontrakt a pre menej písania si ho uložíme na teraz do premennej:

```bash
truffle(development)> const box = await Box.deployed();
```

Skúsme zavolať metódu z kontraktu, a to práve tú na update a uloženie čísla do stateu daného kontraktu, s názvom store()

```bash
truffle(development)> await box.store(42);
```

Na získanie a vypísanie uloženej hodnoty má kontrakt naprogramovanú metódu retrieve()

```bash
truffle(development)> await box.retrieve();
```

Všimnite si, že na zapísanie hodnoty do kontraktu, teda na zmenu stavu, bolo potrebné vykonať transakciu, no na čítanie hodnoty stavu kontraktu nie - to sa deje zadarmo!

Keď chceme vypísať uloženú hodnotu trochu krajšie, môžeme trochu upraviť kód na volanie `retrieve()` a zavolať funkciu na transformáciu výstupu typu `uint256` (v ktorom je tento state uložený) na string - Javascript totiž nevie čítať tak velké, 256-bitové čísla:


```bash
truffle(development)> (await box.retrieve()).toString();
```

Interagovať s kontraktom vieme veľmi jednoducho aj priamo z Javascriptového kódu. Napíšme si teda jednoduchý skript. V zložke `scripts` si vytvoríme súbor `index.js`, do ktorého vložíme náš kód. Tento skript spustíme cez príkaz

    npx truffle exec --network development ./scripts/index.js

Naša aktuálna výhoda je tá, že Truffle "injectuje" do Javascriptového prostredia, v ktorom daný skript `./scripts/index.js` príkaz `exec` spúšta, aj dodatočné závislosti (moduly), teda objekt `web3` (ktorý implementuje funkcie na komunikáciu s Ethereum prostredím a kontraktami)

Kým sa hráme na `development` networku za free ETH, nemusíme až tak riešiť, čo stoja transakcie a koľko nás stojí deployment kontraktu. Na tieto veci si ale treba dať pozor ak by sme kontrakt nahadzovali na "žívý" chain, teda mainnet.

Ohľadom feečiek: dopredu si vieme pozriet koľko stojí aktuálne transakcia: https://ethgasstation.info/. 

### OpenZeppelin kontrakty

OpenZeppelin je firma, ktorá programuje veľkú open-source knižnicu auditovaných smart kontraktov. Tieto kontrakty využíva mnoho projektov v Ethereum ekosystéme a prešlo cez ních už stovky miliónov dolárov.

V tomto repozitári už je táto knižnica pridaná v `package.json` pod názvom `@openzeppelin/contracts` a bola nainštalovaná automaticky pri spustení príkazu `npm install`.

Ak ale tvoríte nový projekt, je potrebné si túto knižnicu doinštalovať:

    npm install --save-dev @openzeppelin/contracts

Ukážkou využitia OpenZeppelin knižnice a jednoduchého ERC20 smart kontraktu je kontrakt `PolisToken` v zložke `contracts`. Pridali sme už aj migračný skript (`/migrations/3_deploy_polis.js`), deploynúť ho môžete rovnako ako `Box` kontrakt podľa návodu vyššie. Ak ale vychádzate z tohto repozitára, je zrejme u vás už aj deploynutý!

## Linky

- [Auditované OpenZeppelin kontrakty](https://github.com/OpenZeppelin/openzeppelin-contracts)
- [The Hitchhiker's Guide to Smart Contracts in Ethereum - OpenZeppelin blog](https://blog.openzeppelin.com/the-hitchhikers-guide-to-smart-contracts-in-ethereum-848f08001f05/)
- [A Gentle Introduction to Ethereum Programming, Part 1 - OpenZeppelin blog](https://blog.openzeppelin.com/a-gentle-introduction-to-ethereum-programming-part-1-783cc7796094/)
- [Contract Wizard](https://docs.openzeppelin.com/contracts/4.x/wizard) na "vyklikanie" si smart kontraktu, ten sa následne dá otvoriť cez Remix IDE a pracovať s ním môžete čisto cez prehliadač
- [Remix IDE](https://remix.ethereum.org/) na programovanie, kompilovanie a deployment smart kontraktov z webového rozhrania
