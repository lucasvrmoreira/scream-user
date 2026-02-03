import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv  
from datetime import datetime 

load_dotenv()

app = Flask(__name__)
CORS(app)

db_url = os.getenv("DATABASE_URL")

if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

if not db_url:
    raise ValueError("A variável DATABASE_URL não foi encontrada. Verifique o .env")

app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)



class Produto(db.Model):
    __tablename__ = 'cellavita'
    __table_args__ = {'schema': 'barthenderweb'} 
    
    id = db.Column(db.Integer, primary_key=True) 
    lote = db.Column('Lote', db.String(100))
    codigo = db.Column('Codigo', db.String(100))
    descricao = db.Column('Descricao', db.String(255))
    status = db.Column('Status', db.String(50))
    validade = db.Column('Validade', db.Date)

    def to_json(self):
        return {
            "lote": self.lote,
            "codigo": self.codigo,
            "descricao": self.descricao,
            "status": self.status,
            "validade": str(self.validade) if self.validade else None
        }


class Colaborador(db.Model):
    __tablename__ = 'colaboradores'
    __table_args__ = {'schema': 'barthenderweb'}

    id = db.Column(db.Integer, primary_key=True)
    matricula = db.Column(db.String(50), unique=True)
    nome = db.Column(db.String(100))
    ativo = db.Column(db.Boolean, default=True)
    cargo = db.Column(db.String(100))


class LogConsulta(db.Model):
    __tablename__ = 'log_consultas'
    __table_args__ = {'schema': 'barthenderweb'}

    id = db.Column(db.Integer, primary_key=True)
    usuario = db.Column(db.String(100))     
    lote_consultado = db.Column(db.String(100))
    data_hora = db.Column(db.DateTime, default=datetime.now) 
    resultado = db.Column(db.String(50))   




@app.route('/api/consultar/<lote_bipado>', methods=['GET'])
def consultar_lote(lote_bipado):
   
    matricula_usuario = request.args.get('usuario') 
    
    if not matricula_usuario:
        return jsonify({"erro": "Identificação do usuário obrigatória"}), 401

    try:
       
        colaborador = Colaborador.query.filter(Colaborador.matricula.ilike(matricula_usuario)).first()

        if not colaborador:
             return jsonify({"erro": "Colaborador não encontrado"}), 403
        
        if not colaborador.ativo:
             return jsonify({"erro": "Acesso negado: Colaborador inativo"}), 403

       
        item = Produto.query.filter_by(lote=lote_bipado).first()
        status_para_log = item.status if item else "NAO_ENCONTRADO"
        
        #
        novo_log = LogConsulta(
            usuario=colaborador.nome, 
            lote_consultado=lote_bipado,
            resultado=status_para_log
        )
        db.session.add(novo_log)
        db.session.commit()

        if item:
            return jsonify({
                "encontrado": True,
                **item.to_json()
            })
        else:
            return jsonify({"encontrado": False}), 404

    except Exception as e:
        return jsonify({"erro": str(e)}), 500

# --- ROTA DE LOGIN (Validação de Entrada) ---
@app.route('/api/login', methods=['GET'])
def validar_login():
    matricula = request.args.get('usuario')
    
    if not matricula:
        return jsonify({"erro": "Matrícula vazia"}), 400

    
    colaborador = Colaborador.query.filter(Colaborador.matricula.ilike(matricula)).first()

    if not colaborador:
        return jsonify({"erro": "Usuário não encontrado"}), 404
    
    if not colaborador.ativo:
        return jsonify({"erro": "Usuário inativo"}), 403

    
    return jsonify({
        "mensagem": "Acesso Permitido",
        "nome": colaborador.nome,
        "cargo": colaborador.cargo
    }), 200


# --- ROTA DE AUDITORIA (Histórico) ---
@app.route('/api/historico', methods=['GET'])
def obter_historico():
    try:
        
        logs = LogConsulta.query.order_by(LogConsulta.data_hora.desc()).limit(50).all()
        
        resultado = []
        for log in logs:
            resultado.append({
                "id": log.id,
                "usuario": log.usuario,
                "lote": log.lote_consultado,
                "resultado": log.resultado,
                "data": log.data_hora.strftime('%d/%m/%Y %H:%M:%S') 
            })
            
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)