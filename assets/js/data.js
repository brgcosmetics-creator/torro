/* VinoTorre — редактируемые данные и локальные фотографии из foto.zip.
 * Неизвестные контакты, домен, характеристики и юридические сведения пустые.
 * Фотографии не подтверждают адрес съёмки, площадь или вид виноградников.
 * originals/ сохраняет исходные скриншоты; сайт загружает оптимизированные WebP.
 * Поля media и wines[].images задают src, srcset, alt и необязательный caption.
 * При замене фото обновите и HTML, чтобы они работали без JavaScript.
 */
window.VINOTORRE_CONFIG = {
  "brand": "VinoTorre",
  "address": "Волгоградская область, Владимирская слобода, улица Державная, 41",
  "instagram": "https://www.instagram.com/vino_torre/",
  "email": "",
  "phone": "",
  "domain": "",
  "media": {
    "hero": {
      "src": "assets/img/cabernet-cellar.webp",
      "srcset": "assets/img/cabernet-cellar-480.webp 480w, assets/img/cabernet-cellar-800.webp 800w, assets/img/cabernet-cellar.webp 1080w",
      "alt": "Бутылка VinoTorre Каберне Совиньон в руках на фоне винных стеллажей"
    },
    "visit": {
      "src": "assets/img/cabernet-cellar.webp",
      "srcset": "assets/img/cabernet-cellar-480.webp 480w, assets/img/cabernet-cellar-800.webp 800w, assets/img/cabernet-cellar.webp 1080w",
      "alt": "Бутылка VinoTorre Каберне Совиньон в руках на фоне винных стеллажей"
    },
    "grapes": {
      "src": "assets/img/grapes.webp",
      "srcset": "assets/img/grapes-480.webp 480w, assets/img/grapes-800.webp 800w, assets/img/grapes.webp 1080w",
      "alt": "Гроздья тёмного винограда и бокал с вином на предоставленной фотографии"
    },
    "collection": {
      "src": "assets/img/merlot-table.webp",
      "srcset": "assets/img/merlot-table-480.webp 480w, assets/img/merlot-table-640.webp 640w, assets/img/merlot-table.webp 755w",
      "alt": "Бутылка VinoTorre Мерло 2025 на столе рядом с бокалом и закусками"
    },
    "detail": {
      "src": "assets/img/cabernet-close.webp",
      "srcset": "assets/img/cabernet-close-480.webp 480w, assets/img/cabernet-close-800.webp 800w, assets/img/cabernet-close.webp 1000w",
      "alt": "Крупный план этикетки VinoTorre Каберне Совиньон 2025 на предоставленной фотографии"
    },
    "route": {
      "src": "assets/img/route.webp",
      "srcset": "assets/img/route-480.webp 480w, assets/img/route-800.webp 800w, assets/img/route.webp 1080w",
      "alt": "Предоставленная схема проезда к VinoTorre, улица Державная, 41"
    }
  },
  "wines": [
    {
      "id": "cabernet-sauvignon",
      "name": "Каберне Совиньон",
      "grape": "Каберне Совиньон",
      "year": "2025",
      "artwork": "assets/img/cabernet-2025.svg",
      "images": [
        {
          "src": "assets/img/cabernet-close.webp",
          "srcset": "assets/img/cabernet-close-480.webp 480w, assets/img/cabernet-close-800.webp 800w, assets/img/cabernet-close.webp 1000w",
          "alt": "Крупный план этикетки VinoTorre Каберне Совиньон 2025 на предоставленной фотографии",
          "caption": "Каберне Совиньон · урожай 2025, этикетка крупным планом"
        }
      ],
      "characteristics": {}
    },
    {
      "id": "merlot",
      "name": "Мерло",
      "grape": "Мерло",
      "year": "2025",
      "artwork": "assets/img/merlot-2025.svg",
      "images": [
        {
          "src": "assets/img/merlot-table.webp",
          "srcset": "assets/img/merlot-table-480.webp 480w, assets/img/merlot-table-640.webp 640w, assets/img/merlot-table.webp 755w",
          "alt": "Бутылка VinoTorre Мерло 2025 на столе рядом с бокалом и закусками",
          "caption": "Мерло · урожай 2025"
        }
      ],
      "characteristics": {}
    }
  ],
  "legal": {
    "ageNotice": "",
    "information": ""
  }
};
window.VINOTORRE_CONFIG.navigationUrl = 'https://yandex.ru/maps/?text=' + encodeURIComponent(window.VINOTORRE_CONFIG.address);
