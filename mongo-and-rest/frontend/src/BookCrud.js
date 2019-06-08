import React, { Component } from "react";
import Modal from "./modal/Modal";

const URL = 'http://localhost:3006/books';

export default class BookCrud extends Component {

    state = {
        books: [],
        modal: null
    }

    async componentDidMount() {
        const response = await fetch(URL)
        const books = await response.json()
        this.setState({ books });
    }

    closeModal = () => {
        this.setState({modal: null})
    }

    render() {

        return (
            <div>
                <Modal show={this.state.modal ? true : false} onClose={this.closeModal}>
                    {this.state.modal}
                </Modal >
                <button onClick={this.create}>Create book</button>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Year</th>
                            <th>Authors</th>
                            <th>Language</th>
                            <th>Pages</th>
                            <th>Delete</th>
                            <th>Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.books.map(book =>
                            <tr key={book._id}>
                                <td>{book.title}</td>
                                <td>{book.year}</td>
                                <td>
                                    <ul>
                                        {book.authors.map((author, i) =>
                                            <li key={i}>{author.name}</li>
                                        )}
                                    </ul>
                                </td>
                                <td>{book.language}</td>
                                <td>{book.pages}</td>
                                <td>
                                    <a href="#" onClick={() => this.delete(book)}>delete</a>
                                </td>
                                <td>
                                    <a href="#" onClick={() => this.update(book)}>update</a>
                                </td>
                            </tr>)}
                    </tbody>
                </table>
            </div>
        )
    }

    delete = async (book) => {
        const response = await fetch(`${URL}/${book._id}`, { method: 'DELETE', headers: { 'Accepts': 'application/json' } });
        if (response.ok) {
            const deleted = await response.json();
            this.setState(prev => ({ books: prev.books.filter(book => book._id != deleted._id) }));
        }
    }

    update = async (book) => {

       const onCompleteEdit = async (book) => {
            const response = await fetch(`${URL}/${book._id}`, { method: 'PUT', body: JSON.stringify(book), headers: { 'Accepts': 'application/json', 'Content-Type': 'application/json' } });
            if (response.ok) {
                const updated = await response.json();
                this.setState(prev => ({ books: prev.books.map(book => book._id == updated._id ? updated : book) }), this.closeModal);
            }
        }

        this.setState({ modal: <BookForm initial={Object.assign({}, book)} onCompletion={onCompleteEdit} /> })
    }

    create = async() => {
        const onCompleteEdit = async(book) => {
            const response = await fetch(`${URL}`, { method: 'POST', body: JSON.stringify(book), headers: { 'Accepts': 'application/json', 'Content-Type': 'application/json' } });
            if (response.ok) {
                const inserted = await response.json();
                this.setState(prev => ({books: [...prev.books, inserted]}), this.closeModal);
            } 
        }
        
        this.setState({ modal: <BookForm initial={null} onCompletion={onCompleteEdit} /> })
    }
}


class BookForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            action: props.initial ? "Update" : "Create",
            book: props.initial || {authors: [{name: ""}]}
        }
    }

    render() {

        const { book, action } = this.state;

        return (
            <form>
                <label>Title</label>
                <input name="title" value={book.title || ""} onChange={this.change} />
                <label>Year</label>
                <input name="year" value={book.year || ""} onChange={this.change} />
                <label>Language</label>
                <input name="language" value={book.language || ""} onChange={this.change} />
                <label>Pages</label>
                <input name="pages" value={book.pages || ""} onChange={this.change} />
                <label>Author</label>
                <input name="author" value={book.authors[0].name || ""} onChange={this.change} />
                <input type="submit" value={action} onClick={e => {
                    e.preventDefault();
                    this.props.onCompletion(this.state.book)
                }} />
            </form>
        )
    }

    change = (e) => {

        const { name, value } = e.target;

        if (name == 'author')
            this.setState(prev => ({
                book: { ...prev.book, authors: [{ name: value }] }
            }))
        else
            this.setState(prev => ({
                book: { ...prev.book, [name]: value }
            }));
    }
}