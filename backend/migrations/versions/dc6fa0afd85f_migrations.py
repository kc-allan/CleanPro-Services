"""Migrations

Revision ID: dc6fa0afd85f
Revises: 3c3eedb25269
Create Date: 2024-07-10 15:53:04.540368

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dc6fa0afd85f'
down_revision: Union[str, None] = '3c3eedb25269'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('bookings', sa.Column('completed_on', sa.DateTime(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('bookings', 'completed_on')
    # ### end Alembic commands ###