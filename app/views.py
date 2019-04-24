import json

from ast import literal_eval
from flask import render_template, request, abort, redirect, url_for
from app.models import Invoice, Users
from app.functions import AlchemyEncoder
from app import application, db, login_manager
from flask_weasyprint import HTML, render_pdf
from flask_login import login_required, login_user, logout_user, current_user


@application.route("/", methods=["GET"])
def index():
    id_variable = request.args.get('i', default=False, type=str)
    download = request.args.get('d', default=0, type=int)
    if id_variable:
        post = db.session.query(Invoice).filter_by(id=id_variable).all()
        output = json.loads(json.dumps(post, cls=AlchemyEncoder))
        items = literal_eval(post[0].items)

        html_text = render_template(
            "invoice-template.html", post=post[0], items=items)
        if download:
            return render_pdf(HTML(string=html_text, base_url=""))
        else:
            return render_template("invoice-template.html", post=post[0], items=items)
    else:
        if current_user.is_authenticated:
            return redirect(url_for('dashboard'))
        else:
            return redirect(url_for('login'))




@application.route("/dashboard", methods=["GET"])
@login_required
def dashboard():
    invoices = db.session.query(Invoice).all()
    # items = literal_eval(post.items)
    # _type = "Invoice"
    # if post.quote == 1:
    #     _type = "Quote"

    # total = sum([items[item]['price'] for item in items])
    return render_template("dashboard.html")


@application.route("/login", methods=["GET", "POST"])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = db.session.query(Users).filter_by(name=username).first()
        try:
            if password == user.password:
                login_user(user)
                return redirect(url_for('dashboard'))
            else:
                abort(401)
        except Exception as e:
            abort(500)
            raise

    else:
        return render_template("login.html")


@application.route("/schedule", methods=["GET"])
def schedule():
    abort(501)


@application.route("/login", methods=["GET", "POST"])
def logout():
    logout_user()
    return redirect(url_for('index'))

# callback to reload the user object


@login_manager.user_loader
def load_user(userid):
    return Users.query.get(userid)
