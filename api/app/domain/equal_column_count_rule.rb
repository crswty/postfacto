#
# Postfacto, a free, open-source and self-hosted retro tool aimed at helping
# remote teams.
#
# Copyright (C) 2016 - Present Pivotal Software, Inc.
#
# This program is free software: you can redistribute it and/or modify
#
# it under the terms of the GNU Affero General Public License as
#
# published by the Free Software Foundation, either version 3 of the
#
# License, or (at your option) any later version.
#
#
#
# This program is distributed in the hope that it will be useful,
#
# but WITHOUT ANY WARRANTY; without even the implied warranty of
#
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#
# GNU Affero General Public License for more details.
#
#
#
# You should have received a copy of the GNU Affero General Public License
#
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
#

class EqualColumnCountRule
  def initialize(chain = NoOpRule.new)
    @chain = chain
  end

  def apply(retro, items)
    columns = split_columns(items.reverse)

    ordered_items = retro.items.map {
      [columns['sad'].shift,
       columns['meh'].shift,
       columns['happy'].shift]
    }.flatten.compact.reverse
    @chain.apply(retro, ordered_items)
  end

  def split_columns(items)
    happy, remainder = items.partition { |item| item.category == 'happy' }
    meh, sad = remainder.partition { |item| item.category == 'meh' }
    {
      'happy' => happy,
      'meh' => meh,
      'sad' => sad
    }
  end
end
