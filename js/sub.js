// 1. 카카오 API 데이터 불러오기
async function fetchBooks(query) {
    const REST_API_KEY = "d18f434b8312735910e3f93ea885a651";
    const params = new URLSearchParams({ target: "title", query, size: 9 });
    const url = `https://dapi.kakao.com/v3/search/book?${params}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `KakaoAK ${REST_API_KEY}` }
    });

    if (!response.ok) throw new Error(`HTTP 오류: ${response.status}`);
    return response.json();
}

// 2. 외부 텍스트 파일 불러오기
async function loadTextFiles() {
    try {
        const introResponse = await fetch('./data/intro.txt');
        if (introResponse.ok) {
            document.getElementById('txt-intro').textContent = await introResponse.text();
        }

        const indexResponse = await fetch('./data/index.txt');
        if (indexResponse.ok) {
            document.getElementById('txt-index').textContent = await indexResponse.text();
            
        } else {
            document.getElementById('txt-index').textContent = "목차를 불러오지 못했습니다.";
        }
        
    } catch (error) {
        console.error("텍스트 파일 통신 에러:", error);
    }
}

// 3. 기능 실행 메인 함수
async function initSubPage(keyword) {
    try {
        const data = await fetchBooks(keyword);
        if (data.documents.length === 0) return alert("검색 결과가 없습니다.");
        const mainBook = data.documents[0]; 

        // ① HTML의 빈 공간에 카카오 데이터 쏙쏙 집어넣기
        document.getElementById('bookThumbnail').src = mainBook.thumbnail;
        document.getElementById('bookTitle').textContent = mainBook.title;
        document.getElementById('bookAuthors').textContent = mainBook.authors.join(', ');
        document.getElementById('authorNameTitle').textContent = mainBook.authors.join(', '); // 작가 탭 이름
        document.getElementById('bookPublisher').textContent = mainBook.publisher;
        
        const price = mainBook.price.toLocaleString();
        const salePrice = mainBook.sale_price > 0 ? mainBook.sale_price.toLocaleString() : price;
        document.getElementById('bookPrice').textContent = price + "원";
        document.getElementById('bookSalePrice').textContent = salePrice + "원";

        // ② 텍스트 파일 데이터 집어넣기
        await loadTextFiles();

        // ③ 공통 탭(작품 정보, 작가 정보) 전환 기능
        const tabMenus = document.querySelectorAll('.tab-menu li');
        tabMenus.forEach(tab => {
            tab.addEventListener('click', function() {
                // 클릭한 탭이 속해있는 구역(section) 찾기
                const parentSection = this.closest('.detail-section');
                const tabs = parentSection.querySelectorAll('.tab-menu li');
                const contents = parentSection.querySelectorAll('.tab-content');

                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                this.classList.add('active');
                const targetId = this.getAttribute('data-tab');
                parentSection.querySelector(`#${targetId}`).classList.add('active');
            });
        });

        // ④ 더보기 버튼 아코디언 기능 (그라데이션 조작)
        const btnMore = document.getElementById('btn-more');
        const introWrapper = document.getElementById('intro-wrapper');
        const introGradient = document.getElementById('intro-gradient');
        
        if (btnMore && introWrapper) {
            btnMore.addEventListener('click', () => {
                if (introWrapper.style.maxHeight === '250px' || introWrapper.style.maxHeight === '') {
                    introWrapper.style.maxHeight = '3000px'; // 전체 보기
                    introGradient.style.background = 'transparent';
                    introGradient.style.position = 'relative';
                    introGradient.style.height = 'auto';
                    btnMore.innerHTML = '접기 ▲';
                } else {
                    introWrapper.style.maxHeight = '250px'; // 축소하기
                    introGradient.style.background = 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1) 80%)';
                    introGradient.style.position = 'absolute';
                    introGradient.style.height = '100px';
                    btnMore.innerHTML = '더보기 ▼';
                }
            });
        }

    } catch (error) {
        console.error("데이터 초기화 실패:", error);
    }
}

// 4. 페이지 시작 시 함수 실행
document.addEventListener("DOMContentLoaded", () => {
    initSubPage("컬처"); // 검색어
});