from faker import Faker
from random import choice, randint
import json
import MySQLdb


class dbConnect():
    def __init__(self, h="localhost", u="strixx", p="toor" , d="invoiceSystem", port=3306):
        self.db = MySQLdb.connect(host=h, user=u, passwd=p , database=d, port=port)
        self.cur = 0

    def __enter__(self):
        self.db.set_character_set('utf8')
        self.db.autocommit(False)
        self.cur = self.db.cursor()
        return self.cur

    def __exit__(self, type, value, traceback):
        self.cur.close()
        self.db.commit()
        self.db.close()

def fakeTime():
    """ Generate fake time"""

    hours = random.randint(7, 18)
    minutes = ['00', 15, 30, 45]

    if 0 <= hours <= 9:
        hours = '0' + str(hours)

    return "%s:%s" % (hours, random.choice(minutes))


def fakeInvoice():

    to_name = fake.name_male()
    to_address = "{} {}".format(fake.postcode(), fake.street_name())
    to_city_state = "{}, {} {}".format(
        fake.city(), fake.state(), fake.zipcode_in_state())
    from_name = fake.name_male()
    from_address = "{} {}".format(fake.postcode(), fake.street_name())
    from_city_state = "{}, {} {}".format(
        fake.city(), fake.state(), fake.zipcode_in_state())
    issued_date = fake.date_this_year(before_today=False, after_today=True)
    warrenty_days = randint(1, 182)

    items = {}

    for x in range(1, randint(2, 5)):
        items["item-%s" % x] = {"description": fake.sentences(
            nb=1, ext_word_list=None)[0], "price": randint(200, 5000)}

    warranty_description = "\n".join(fake.paragraphs(nb=3, ext_word_list=None))
    type = choice([ "Invoice", "Quote" ])
    total = randint(200, 50000)

    return [to_name, to_address, to_city_state, from_name, from_address, from_city_state, json.dumps(items), warranty_description, warrenty_days, type, total, issued_date]

fake = Faker()
data = [fakeInvoice() for x in range(500)]
with dbConnect() as cur:
    query = "INSERT IGNORE INTO invoice (to_name, to_address, to_city_state, from_name, from_address, from_city_state, items, warranty_description, warranty_period, type, total, issued_date) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"
    cur.executemany(query, data)
