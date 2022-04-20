# going to shifted to fastapi framework soon

# importing required modules
from flask import Flask, jsonify
import datetime
import hashlib
import json
from werkzeug.wrappers import response

# Blockchain structure

class Blockchain:
    def __init__(self):
        self.chain = []
        self.create_block(proof = 1, prev = '0')
    
    def create_block(self, proof, prev):
        block = {'index' : len(self.chain) + 1,
                 'timestamp' : str(datetime.datetime.now()), 
                 'proof' : proof, 
                 'previous_hash' : prev }
        self.chain.append(block)
        return block
    
    def get_previous(self):
        return self.chain[-1]
    
    def proof_of_work(self, prev_proof):
        new_proof = 1
        check_proof = False
        while check_proof is False:
            _operartion = hashlib.sha256(str(new_proof**2 - prev_proof**2).encode()).hexdigest()
            if _operartion[:4] == '0000':
                check_proof = True
            else:
                new_proof+=1
        return new_proof
    
    # Hashing class-method to encrypt transactions
    def hash(self, block):
        encoded_block = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(encoded_block).hexdigest()
    
    # Validation class-method to 
    def isChain_valid(self, chain):
        prev_block = chain[0]
        block_index = 1
        while(block_index < len(chain)):
            block = chain[block_index]
            if block['previous_hash'] != self.hash(prev_block):
                return False
            prev_proof = prev_block['proof']
            proof = block['proof']
            _operartion = hashlib.sha256(str(proof**2 - prev_proof**2).encode()).hexdigest()
            if _operartion[:4] != '0000':
                return False
            prev_block = block
            block_index += 1
        return True
       
# Block mining apis

Creating a web app for exploring our block chain
app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False

@app.route('/mine_block', methods=['GET','POST'])
def mine_block():
    previous_block = blockchain.get_previous()
    previous_proof = previous_block['proof']
    proof = blockchain.proof_of_work(previous_proof)
    previous_hash = blockchain.hash(previous_block)
    block = blockchain.create_block(proof,previous_hash)
    response = {'message' : 'Congrats',
                'index' : block['index'],
                'proof' : block['proof'],
                'prev_hash' : block['previous_hash']} 
    return jsonify(response), 200

@app.route('/get_chain', methods= ['GET','POST'])
def get_chain():
    response = {'chain' : blockchain.chain,
                'chain_length' : len(blockchain.chain)}
    return jsonify(response), 200

@app.route('/validity_check',methods =['GET','POST'])
def if_valid():
    isvalid = blockchain.isChain_valid(blockchain.chain)
    if isvalid:
        response = {'message' : 'The chain is intact.'}
    else:
        response = {'message' : 'The chain is not intact'}
    return jsonify(response), 200

# Initialize a block chain
blockchain = Blockchain()

# Starting the App in local host with debug to reload on changes
app.run(host='0.0.0.0',port=8000,debug=True)
