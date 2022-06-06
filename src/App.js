import "./App.css";
import {useState} from "react";


function App() {
    const DEFAULT_FROM = 'en';
    const DEFAULT_TO = 'uk';
    const [text, setText] = useState("");
    const [fromLang, setFromLang] = useState(DEFAULT_FROM);
    const [toLang, setToLang] = useState(DEFAULT_TO);
    const [message, setMessage] = useState("");
    const [translatedText, setTranslatedText] = useState("");

    let handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch("http://localhost/api/translate", {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    'text': text,
                    'from-lang': fromLang,
                    'to-lang': toLang,
                }),
            })
                .then(async response => {
                    const isJson = response.headers.get('content-type')?.includes('application/json');
                    const data = isJson && await response.json();

                    if (!response.ok) {
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    }

                    setFromLang(DEFAULT_FROM);
                    setToLang(DEFAULT_TO);
                    setTranslatedText(data.result)
                })
                .catch(error => {
                    setMessage(error.message);
                });
        } catch (err) {
            console.log(err);
        }
    };

    let handleFile = async (e) => {
        var file = e.target.files[0];

        if (file) {
            let reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                 setText(evt.target.result);
            }
            reader.onerror = function (evt) {
                setMessage('Error')
            }
        }
    }

    return (
        <div className="App">
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    onChange={handleFile}
                />
                <select
                    value={fromLang}
                    onChange={(e) => setFromLang(e.target.value)}
                >
                    <option value="en">English</option>
                </select>
                <select
                    value={toLang}
                    onChange={(e) => setToLang(e.target.value)}
                >
                    <option value="ukr">Ukraine</option>
                    <option value="fr">Franche</option>
                </select>

                <button type="submit">Create</button>

                <div className="message">{message ? <p>{message}</p> : null}</div>
                <div>{translatedText ? <p>{translatedText}</p> : null}</div>
            </form>
        </div>
    );
}

export default App;