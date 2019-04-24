import mistune
import hashlib
import json
from sqlalchemy.ext.declarative import DeclarativeMeta
from datetime import date


def warrentyMarkdown(text):
    return markdown2html(text)


def makeID(string):
    hashed = hashlib.md5(string.encode('utf-8')).hexdigest()
    return hashed[0:7]


class AlchemyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj.__class__, DeclarativeMeta):
            # an SQLAlchemy class
            fields = {}
            for field in [x for x in dir(obj) if not x.startswith('_') and x != 'metadata']:
                data = obj.__getattribute__(field)
                if isinstance(data, date):
                    data = data.strftime("%Y-%m-%d")
                try:
                    # this will fail on non-encodable values, like other classes
                    json.dumps(data)
                    fields[field] = data
                except TypeError:
                    pass
            # a json-encodable dict
            return fields

        return json.JSONEncoder.default(self, obj)
