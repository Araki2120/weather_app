//スタート画面の設定
const start = document.querySelector('#startBox');
const main = document.querySelector('#mainBox');

start.addEventListener('click', function () {
    start.classList.add('close');
    main.classList.add('open');
});


//位置情報の取得
const success = (pos) => {
    ajaxRequest(pos.coords.latitude, pos.coords.longitude);
}

const fail = (error) => {
    alert('位置情報の取得に失敗しました。エラーコード：' + error.code);
}

navigator.geolocation.getCurrentPosition(success, fail);


//UTCをミリ秒に設定
const utcToJSTime = (utsTime) => {
    return utsTime * 1000;
}

//データの取得
const ajaxRequest = (lat, long) => {
    const url = 'https://api.openweathermap.org/data/2.5/forecast';
    const appId = '60cb0106ab77550937357355d7367f36';

    const params = new URLSearchParams({
        appId: appId,
        lat: lat,
        lon: long,
        units: 'metric',
        lang: 'ja',
    });

    //acync,awaitの実行
    async function fetchData(url, params) {
        try {
            const response = await fetch(`${url}?${params}`);

            if (!response.ok) {
                throw new Error('ネットワークに接続できません。');
            }
            const data = await response.json();

            // 都市名・国名
            const place = document.querySelector('#mainBox__place');
            place.textContent = data.city.name + ':' + data.city.country;

            //天気予報のデータ
            for (let i = 0; i < data.list.length; i++) {
                const forecast = data.list[i];
                const dateTime = new Date(utcToJSTime(forecast.dt));
                const month = dateTime.getMonth() + 1;
                const date = dateTime.getDate();
                const hours = dateTime.getHours();
                const min = String(dateTime.getMinutes()).padStart(2, '0');
                const temperature = Math.round(forecast.main.temp);
                const description = forecast.weather[0].description;
                const iconPath = `images/${forecast.weather[0].icon}.svg`;

                if (i === 0) {
                    const currentWeather = `
                        <div class="mainBox__icon"><img src="${iconPath}" alt="お天気アイコン"></div>
                        <div class="mainBox__info">
                            <p>
                                <span class="mainBox__description">現在のお天気:${description}</span>
                                <span class="mainBox__temp">${temperature}</span>℃
                            </p>
                        </div>`;
                    const weather = document.querySelector('#mainBox__weather');
                    weather.innerHTML = currentWeather;
                } else {
                    const list = `
                        <ul class="forecast__ul">
                            <li class="forecast__info">${month}/${date} ${hours}:${min}</li>
                            <li class="forecast__icon"><img src="${iconPath}" alt="お天気アイコン"></li>
                            <li><span class="forecast__description">${description}</span></li>
                            <li><span class="forecast__temp">${temperature}℃</span></li>
                        </ul>`;
                    const fore = document.querySelector('#forecast');
                    // fore.innerHTML = list;
                    fore.insertAdjacentHTML('beforeend', list);
                }
            }
        } catch (error) {
            window.alert(error);
        } finally {
            console.log('処理完了しました');
        }
    }
    // この関数を呼び出す
    fetchData(url, params);
}


//現在時刻の表示
let hour;

function recalc() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;//0-11になるので１足す
    const date = now.getDate();
    hour = now.getHours();
    const min = now.getMinutes();
    const doubleHour = String(hour).padStart(2, '0');
    const doublemin = String(min).padStart(2, '0');//2桁にする
    const nowDates = `${year}.${month}.${date}`;
    const nowTimes = `${doubleHour}:${doublemin}`

    //HTMLの書き換え
    const dateBox = document.querySelector('.mainBox__date');
    const timeBox = document.querySelector('.mainBox__time');

    dateBox.textContent = nowDates;
    timeBox.textContent = nowTimes;

    refresh();
}

//1秒ごとに更新する
function refresh() {
    setTimeout(recalc, 1000);
}

//時間表示の呼び出し
recalc();

//時間に合わせて背景の色を変更
const daytimeBg = () => {
    bubbly({
        blur: 0,
        bubbles: 24,
        colorStart: 'rgba(107, 238, 255, 1)',
        colorStop: 'rgba(28, 122, 255, 1)',
        velocityFunc: () => 0.1 + Math.random() * 0.1,
        radiusFunc: () => 4 + Math.random() * 20,
    });
};

const eveningBg = () => {
    bubbly({
        blur: 0,
        bubbles: 24,
        colorStart: 'rgba(252, 230, 131, 1)',
        colorStop: 'rgba(255, 96, 28, 1)',
        velocityFunc: () => 0.1 + Math.random() * 0.1,
        radiusFunc: () => 4 + Math.random() * 20,
    });
};

const nightBg = () => {
    bubbly({
        blur: 0,
        bubbles: 24,
        colorStart: 'rgba(248,255,201,1)',
        colorStop: 'rgba(17,26,120,1)',
        velocityFunc: () => 0.1 + Math.random() * 0.1,
        radiusFunc: () => 4 + Math.random() * 20,
    });
};

if (hour >= 16 && hour < 19) {
    //夕方の設定
    eveningBg();
} else if (hour >= 19 || hour < 4) {
    //夜の設定
    nightBg();
} else {
    //日中の設定
    daytimeBg();
}

//進捗確認用
console.log('最後まで進みました');