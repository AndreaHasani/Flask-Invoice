from app import db
from flask_login import login_required, login_user, logout_user, current_user
from app.models import Invoice
from app.functions import AlchemyEncoder, makeID
from flask import jsonify, render_template, abort, request, Response
from flask_restful import Resource, reqparse
from ast import literal_eval
from datetime import datetime
import json
import time

invoice_args = [
    "from_name",
    "from_address",
    "from_city_state",
    "to_name",
    "to_address",
    "to_city_state",
    "items",
    "id",
    "total",
    "issued_date",
    "warranty_description",
    "warranty_period",
    "payment_method",
    "payment_email",
    "type",
    "request_type"
]

parser = reqparse.RequestParser()
for args in invoice_args:
    parser.add_argument(args)


class api_invoice(Resource):
    def post(self):
        args = parser.parse_args()
        dummy = {
            "from_name": "From Name",
            "from_address": "From Address",
            "from_city_state": "From City State",
            "to_name": "To Name",
            "to_address": "To Address",
            "to_city_state": "To City State",
        }
        # post = db.session.query(invoice).first()
        # items = literal_eval(post.items)
        items_num = int(args['items'])
        items = {}
        for num in range(items_num):
            items[num] = {}
            items[num]['description'] = "#Item %s" % num
            items[num]['price'] = 0

        del(args['items'])

        total = sum([items[item]['price'] for item in items])
        return make_response(render_template("invoice-template.html", post=dummy, items=items, total=total))


class api_invoices(Resource):
    def get(self):
        try:
            current_user.id
        except AttributeError as e:
            abort(403)

        download = request.args.get("download", 0)
        if download:
            if current_user.admin:
                posts = db.session.query(Invoice).all()
            else:
                posts = db.session.query(Invoice).filter(Invoice.user_id == current_user.id).all()
            output = json.loads(json.dumps(posts, cls=AlchemyEncoder))
            return jsonify(output)
        else:
            posts = db.session.query(Invoice).filter(
                Invoice.hidden != 1, Invoice.user_id == current_user.id).all()
            output = json.loads(json.dumps(posts, cls=AlchemyEncoder))
            return jsonify(output)


class api_invoice(Resource):
    def get(self):
        args=parser.parse_args()
        post=db.session.query(Invoice).filter_by(id = args['id']).all()
        output=json.loads(json.dumps(post, cls=AlchemyEncoder))

        if args['request_type'] == 'data':
            return output
        if args['request_type'] == 'html':
            items=literal_eval(post[0].items)
            return render_template("invoice-template.html", post = post[0], items = items)

    def post(self):
        try:
            current_user.id
        except AttributeError as e:
            abort(403)

        args=parser.parse_args()
        args=dict((k, v) for k, v in args.items() if v is not None)
        args['user_id']=current_user.id
        view_return={}
        if args['request_type'] == 'add':
            print(args)
            args['id']=makeID(args['total'] +
                                args['to_name'] + args['from_name'] + str(time.time()))
            args['issued_date']=datetime.today().strftime("%Y-%m-%d")
            del args['request_type']
            newCol=Invoice(**args)
            db.session.add(newCol)
            view_return={
                'status': 200, 'id': args['id'], 'date': args['issued_date'], 'action': 'add'}

        elif args['request_type'] == 'update':
            del args['request_type']
            db.session.query(Invoice).filter_by(id=args['id']).update(args)
            view_return = {'status': 200, 'id': args['id'], 'action': 'update'}

        elif args['request_type'] == 'delete':
            row = db.session.query(Invoice).filter_by(id=args['id']).first()
            row.hidden = True
            view_return = {'status': 200, 'id': args['id'], 'action': 'delete'}

        db.session.commit()
        return jsonify(view_return)
