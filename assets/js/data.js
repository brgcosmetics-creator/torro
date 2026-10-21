/*
 * VinoTorre — единый файл для сменных и неподтверждённых данных.
 * Публикуйте только согласованные сведения. Пустые значения не выводятся.
 * Пути изображений считаются от HTML-страниц: assets/img/filename.webp.
 * Сайт не отправляет данные формы самостоятельно: используется mailto.
 */
window.VINOTORRE_CONFIG = {
  brand: 'VinoTorre',
  address: 'Волгоградская область, Владимирская слобода, улица Державная, 41',
  instagram: 'https://www.instagram.com/vino_torre/',
  email: '',
  phone: '',
  // Окончательный домен неизвестен. Укажите здесь полный HTTPS-адрес.
  domain: '',
  navigationUrl: 'https://yandex.ru/maps/?text=' + encodeURIComponent(
    'Волгоградская область, Владимирская слобода, улица Державная, 41'
  ),
  media: {
    // Только собственные фотографии или материалы с разрешением на публикацию.
    // Пример srcset: 'assets/img/name-640.webp 640w, assets/img/name-1280.webp 1280w'.
    estate: { src: '', srcset: '', alt: '' },
    landscape: { src: '', srcset: '', alt: '' },
    vineyard: { src: '', srcset: '', alt: '' },
    // Изображение маршрута не подтверждает время поездки и расстояние.
    route: { src: '', srcset: '', alt: '' }
  },
  wines: [
    {
      id: 'cabernet-sauvignon',
      name: 'Каберне Совиньон',
      grape: 'Каберне Совиньон',
      year: '2025',
      artwork: 'assets/img/cabernet-2025.svg',
      // [{ src: 'assets/img/cabernet.webp', alt: 'Описание фотографии', srcset: '', caption: '' }]
      images: [],
      // Только подтверждённые характеристики: { 'Крепость': '…' }.
      characteristics: {}
    },
    {
      id: 'merlot',
      name: 'Мерло',
      grape: 'Мерло',
      year: '2025',
      artwork: 'assets/img/merlot-2025.svg',
      images: [],
      characteristics: {}
    }
  ],
  // Текст согласовывается владельцем с учётом применимого законодательства.
  legal: { ageNotice: '', information: '' }
};
