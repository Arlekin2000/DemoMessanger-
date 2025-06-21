from fastapi import Request, APIRouter
import peewee as pw
from marshmallow import fields
from marshmallow_peewee import ModelSchema

from backend.models import City

router = APIRouter(prefix="/api/users/v1/cities", tags=["cities"])


class CitySchema(ModelSchema):
    id = fields.Integer()
    name = fields.Str()


@router.get('')
async def get_cities(request: Request):
    where = request.query_params.get('where')
    query = City.select()
    if where:
        query = query.where(City.search_name.startswith(where.lower()))

    # query = query.limit(100)
    return CitySchema().dump(await query, many=True)
