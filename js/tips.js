// tips.js
class AffirmationManager {
    constructor() {
        this.affirmations = [
            "Hoy respeto mis límites",
            "Mi respiración es mi ancla",
            "Soy suficiente tal como soy",
            "Confío en mi proceso",
            "Puedo con lo que venga, un paso a la vez",
            "Merezco momentos de calma",
            "Cada día es una nueva oportunidad",
            "Estoy construyendo mi bienestar"
        ];
        this.affirmationText = document.getElementById('affirmationText');
        this.newBtn = document.getElementById('newAffirmationBtn');
        this.favBtn = document.getElementById('favoriteAffirmationBtn');
        this.favoritesList = document.getElementById('favoriteAffirmations');

        this.loadRandom();
        this.loadFavorites();
        this.newBtn.addEventListener('click', () => this.loadRandom());
        this.favBtn.addEventListener('click', () => this.saveFavorite());
    }

    loadRandom() {
        const randomIndex = Math.floor(Math.random() * this.affirmations.length);
        this.currentAffirmation = this.affirmations[randomIndex];
        this.affirmationText.textContent = `“${this.currentAffirmation}”`;
    }

    saveFavorite() {
        if (!this.currentAffirmation) return;
        const favs = JSON.parse(localStorage.getItem('favoriteAffirmations') || '[]');
        if (!favs.includes(this.currentAffirmation)) {
            favs.push(this.currentAffirmation);
            localStorage.setItem('favoriteAffirmations', JSON.stringify(favs));
            this.loadFavorites();
        }
    }

    loadFavorites() {
        const favs = JSON.parse(localStorage.getItem('favoriteAffirmations') || '[]');
        this.favoritesList.innerHTML = '';
        if (favs.length === 0) {
            this.favoritesList.innerHTML = '<li style="color:var(--text-light)">Aquí irán las afirmaciones que más te fortalezcan</li>';
            return;
        }
        favs.forEach(text => {
            const li = document.createElement('li');
            li.textContent = '⭐ ' + text;
            this.favoritesList.appendChild(li);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new AffirmationManager());