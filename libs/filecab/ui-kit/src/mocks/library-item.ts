import { LibraryItemV2 } from "@filecab/models/library";
import { LibraryItemType } from "@filecab/models";
import { Types } from "@filecab/models/types";

export const MOCK_LIBRARY_ITEM: LibraryItemV2 = {
  "comment": "",
  "item": {
    "title": "Нет игры — нет жизни: Начало",
    originalTitle: '',
    "image": "https://smotret-anime.online/posters/15277.41034723594.jpg",
    "url": "https://smotret-anime.com/catalog/no-game-no-life-zero-15277",
    "description": "Эта история происходит за шесть тысяч лет до того, как Сора и Сиро появились в истории Дисборда.\nВойна уничтожила землю, разрывая небеса, разрушая звёзды и даже угрожая уничтожить всё человечество. Среди хаоса и разрушения молодой человек по имени Рику ведёт человечество к завтрашнему дню по велению своего сердца. В один прекрасный день, в руинах города эльфов, он встречает Шуви, девушку-изгнанницу экс-машин, которая просит научить её, что значит иметь человеческое сердце.",
    "genreIds": [
      2,
      4,
      41
    ],
    "year": 2017,
    "type": LibraryItemType.movie,
    "popularity": 8.21, // todo fix string
    "episodes": 2,
    "id": 118
  },
  "progress": 0,
  "star": 10,
  "status": "complete",
  "url": "https://shikimori.one/animes/z33674",
  dateAd: '',
  dateChange: '',
  type: Types.anime,
}