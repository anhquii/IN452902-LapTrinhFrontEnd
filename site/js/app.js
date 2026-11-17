// Câu 2: viết JavaScript tại đây

const API_URL = 'http://localhost:4000';

// Hàm có sẵn: đổi giờ UTC sang giờ Việt Nam, vd "08:00 12/09/2026"
const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit', minute: '2-digit',
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

const statusEl = document.querySelector('#status');
const eventList = document.querySelector('#event-list');
const searchForm = document.querySelector('#search-form');
const keywordInput = document.querySelector('#keyword');

const formatSeats = (event) => {
  const left = event.capacity - event.registeredCount;
  if (left <= 0) 
  {
    return 'Hết chỗ';
  }
  return `Còn ${left}/${event.capacity} chỗ`;
};


const renderEvents = (events) => {
  const cards = events.map((event) => {
    const article = document.createElement('article');
    article.className = 'card';


    const img = document.createElement('img');
    img.setAttribute('src', 'img/event.svg');
    img.setAttribute('alt', event.name);

    const body = document.createElement('div');
    body.className = 'card__body';

    const h2 = document.createElement('h2');
    const link = document.createElement('a');
    link.setAttribute('href', `event-detail.html?id=${event.id}`);
    link.textContent = event.name;
    h2.appendChild(link);

    const timeP = document.createElement('p');
    const timeEl = document.createElement('time');
    timeEl.setAttribute('datetime', event.startTime);
    timeEl.textContent = formatDateTime(event.startTime);
    timeP.appendChild(timeEl);


    const locationP = document.createElement('p');
    locationP.textContent = event.location;

    const seatsP = document.createElement('p');
    const seatsText = formatSeats(event);
    if (seatsText === 'Hết chỗ')
    {
      const badge = document.createElement('span');
      badge.className = 'badge--full';
      badge.textContent = seatsText;
      seatsP.appendChild(badge);
    }
    else
    {
      seatsP.textContent = seatsText;
    }

    body.append(h2, timeP, locationP, seatsP);
    article.append(img, body);
    return article;

  });

  eventList.replaceChildren(...cards);
}



const loadEvents = async (keyword = '') => {
  statusEl.textContent = 'Đang tải...';

  const params = new URLSearchParams({ pageSize: '50' });
  const q = keyword.trim();

  if (q)
  {
    params.set('q', q);

  }

  try
  {
    const response = await fetch(`${API_URL}/api/events?${params.toString()}`);
    if (!response.ok)
    {
      throw new Error('HTTP error');
    }

    const data = await response.json();
    const items = data.items || [];
    renderEvents(items);

    if (items.length === 0)
    {
      statusEl.classList.add('status--error');
      statusEl.textContent = 'Không có sự kiện nào khớp từ khóa';
    }
    else
    {
      statusEl.textContent = `Tìm thấy ${items.length} sự kiện`;
    }
    

  }

  catch
    {
      statusEl.classList.add('status--error');
      statusEl.textContent = 'Không tải được dữ liệu, vui lòng thử lại';
    }



};



searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  loadEvents(keywordInput.value.trim());
});





loadEvents();


