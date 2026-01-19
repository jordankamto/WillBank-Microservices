#!/usr/bin/env node

/**
 * Script pour trouver l'adresse IP réseau de votre ordinateur
 * Exécutez: node find-ip.js
 */

const { networkInterfaces } = require('os');
const nets = networkInterfaces();

console.log('🔍 Recherche de votre adresse IP réseau...\n');

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            console.log(`Interface: ${name}`);
            console.log(`Adresse IP: ${net.address}`);
            console.log(`Utilisez cette URL dans votre app mobile:`);
            console.log(`   http://${net.address}:8080`);
            console.log(`   (remplacez 8080 par le port de votre API Gateway)\n`);
        }
    }
}

