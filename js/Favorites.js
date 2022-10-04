import { GithubUser } from "./GitHubUser.js"

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()

    }


    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []

    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username)
            if (userExists) {
                throw new Error('Usuário já cadastrado')
            }

            const user = await GithubUser.search(username)

            if (user.login === undefined) {
                throw new Error('User not found!')
            }
            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch (error) {
            alert(error.message)
        }
    }

    delete(user) {
        const filteresEntries = this.entries.filter(entry =>
            entry.login !== user.login)

        this.entries = filteresEntries
        this.update()
        this.save()
    }
}


export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
    }

    onadd() {

        const addButton = this.root.querySelector('.btn-search')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('#input-search')


            this.add(value)
        }
    }

    update() {

        this.emptyList()
        this.removeAllTr()

        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Image de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar essa linha?')
                if (isOk) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })

    }


    createRow() {

        const tr = document.createElement('tr')

        tr.innerHTML = `
        <td class="user">
            <img src="https://github.com/vinizbjj.png" alt="">
            <a href="">
                <p>Vinizbjj</p>
                <span>/Vinizbjj</span>
            </a>
        </td>
        <td class="repositories">123</td>
        <td class="followers">1234</td>
        <td>
            <button class="remove">Remove</button>
        </td>    
        `
        return tr
    }

    removeAllTr() {


        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
                tr.remove()
            })
    }

    emptyList() {
        const container = document.getElementById("und");
        const entriesIsEmpty = this.entries.length >= 1;
        if (entriesIsEmpty) {
            container.style.display = "none";

            return;
        }else{
            container.style.display = "flex";
        }
    }

}