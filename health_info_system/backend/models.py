from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Country(db.Model):
    cname = db.Column(db.String(50), primary_key=True)
    population = db.Column(db.BigInteger, nullable=False)
    users = db.relationship('Users', backref='country', lazy=True)
    discovers = db.relationship('Discover', backref='country', lazy=True)
    records = db.relationship('Record', backref='country', lazy=True)

    def to_dict(self):
        return {
            "cname": self.cname,
            "population": self.population,
        }


class Users(db.Model):
    email = db.Column(db.String(60), primary_key=True)
    name = db.Column(db.String(30), nullable=False)
    surname = db.Column(db.String(40), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    cname = db.Column(db.String(50), db.ForeignKey('country.cname'), nullable=False)

    def to_dict(self):
        return {
            "email": self.email,
            "name": self.name,
            "surname": self.surname,
            "phone": self.phone,
            "cname": self.cname,
        }


class Patient(db.Model):
    email = db.Column(db.String(60), db.ForeignKey('users.email'), primary_key=True)
    diseases = db.relationship('PatientDisease', backref='patient', lazy=True)


class DiseaseType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(140), nullable=False)
    diseases = db.relationship('Disease', backref='disease_type', lazy=True)
    specializations = db.relationship('Specialize', backref='disease_type', lazy=True)


class Disease(db.Model):
    disease_code = db.Column(db.String(50), primary_key=True)
    pathogen = db.Column(db.String(20), nullable=False)
    description = db.Column(db.String(140), nullable=False)
    id = db.Column(db.Integer, db.ForeignKey('disease_type.id'), nullable=False)
    patient_diseases = db.relationship('PatientDisease', backref='disease', lazy=True)


class Discover(db.Model):
    cname = db.Column(db.String(50), db.ForeignKey('country.cname'), primary_key=True)
    disease_code = db.Column(db.String(50), db.ForeignKey('disease.disease_code'), primary_key=True)
    first_enc_date = db.Column(db.Date, nullable=False)


class PatientDisease(db.Model):
    email = db.Column(db.String(60), db.ForeignKey('patient.email'), primary_key=True)
    disease_code = db.Column(db.String(50), db.ForeignKey('disease.disease_code'), primary_key=True)
    salary = db.Column(db.Integer, nullable=False)


class PublicServant(db.Model):
    email = db.Column(db.String(60), db.ForeignKey('users.email'), primary_key=True)
    department = db.Column(db.String(50), nullable=False)
    records = db.relationship('Record', backref='public_servant', lazy=True)


class Doctor(db.Model):
    email = db.Column(db.String(60), db.ForeignKey('users.email'), primary_key=True)
    degree = db.Column(db.String(20), nullable=False)
    salary = db.Column(db.Integer, nullable=False)
    specializations = db.relationship('Specialize', backref='doctor', lazy=True)


class Specialize(db.Model):
    id = db.Column(db.Integer, db.ForeignKey('disease_type.id'), primary_key=True)
    email = db.Column(db.String(60), db.ForeignKey('doctor.email'), primary_key=True)


class Record(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(60), db.ForeignKey('public_servant.email'), nullable=False)
    cname = db.Column(db.String(50), db.ForeignKey('country.cname'), nullable=False)
    disease_code = db.Column(db.String(50), db.ForeignKey('disease.disease_code'), nullable=False)
    total_deaths = db.Column(db.Integer, nullable=False)
    total_patients = db.Column(db.Integer, nullable=False)
