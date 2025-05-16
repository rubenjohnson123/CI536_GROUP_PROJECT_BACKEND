import spacy
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
    

nlp = spacy.load("en_core_web_md")  


categories = {
    "account": ["account", "register", "sign up", "login", "password"],
    "listing": ["list item", "sell", "price", "product", "marketplace"],
    "support": ["help", "support", "refund", "contact", "issue"],
    "off-topic": ["president", "joke", "weather", "capital", "movie", "song", "history", "sports", "tv", "celebrity", "politics", "news"]
}

intent_phrases = {
    "list_item": ["list an item", "sell something", "how to list", "where can i sell"],
    "create_account": ["create an account", "sign up", "register"],
    "allowed_items": ["what can I sell", "allowed items", "categories"],
}


responses = {
    "list_item": "To list an item, click the **'Sell'** button at the top of the homepage. Fill in your item details and submit — it’s quick and easy!",
    "create_account": "To create an account, click the **'Login'** button at the top right, then select 'Register' from the login page.",
    "allowed_items": "You can list books, electronics, groceries, clothing, furniture, and more. Just make sure your item fits within our student marketplace guidelines.",
    "general_chat": "Hi there! You can ask me about listing items, registering, or what categories are allowed. How can I help?",
    "off_topic": "I’m here to help with the student marketplace. Try asking about accounts, categories, or selling an item!"
}


def detect_intent(user_message):
    
    doc = nlp(user_message.lower())
  
    filtered_tokens = [token.text for token in doc if not token.is_stop]
    filtered_message = " ".join(filtered_tokens)
    doc_filtered = nlp(filtered_message)

    
    if is_off_topic(user_message):
        return "off_topic"

    best_match = ("general_chat", 0.3)  

    for intent, phrases in intent_phrases.items():
        for phrase in phrases:
            phrase_doc = nlp(phrase)
            similarity = doc_filtered.similarity(phrase_doc)
            if similarity > best_match[1]:  
                best_match = (intent, similarity)

  
    if best_match[1] < 0.4:  
        return "off_topic"

    return best_match[0]

def log_unmatched_query(user_message):
    
    category = categorize_query(user_message)
    with open("unmatched_queries.log", "a") as log_file:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_file.write(f"{timestamp} - {user_message} - Category: {category}\n")

def categorize_query(query):
    doc = nlp(query.lower())

    
    if is_off_topic(query):
        return "off-topic"

    best_match = ("off-topic", 0.0)
    for category, phrases in categories.items():
        for phrase in phrases:
            phrase_doc = nlp(phrase.lower())
            similarity = doc.similarity(phrase_doc)
            if similarity > best_match[1]:
                best_match = (category, similarity)

   
    if best_match[1] < 0.6:
        return "off-topic"

    return best_match[0]


def is_off_topic(user_message):
   
    doc = nlp(user_message)

    off_topic_keywords = {
        "president", "joke", "weather", "capital", "movie", "song", "history", 
        "sports", "tv", "celebrity", "politics", "news"
    }
    off_topic_entities = {"PERSON", "GPE", "ORG", "DATE", "TIME", "MONEY"}

    off_topic_count = sum(1 for ent in doc.ents if ent.label_ in off_topic_entities)

    for token in doc:
        if token.text.lower() in off_topic_keywords:
            return True

    return off_topic_count >= 1

@app.route("/chat", methods=["POST"])
def chat():
    
    user_input = request.json.get("message")  # type: ignore
    intent = detect_intent(user_input)  

    if intent == "off_topic":
        log_unmatched_query(user_input)

    response = responses.get(intent, responses["general_chat"])
    return jsonify({"response": response})

@app.route("/health", methods=["GET"])
def health_check():
    
    return jsonify({"status": "ok", "message": "Chatbot server is running!"})

if __name__ == "__main__":
    app.run(port=5001, debug=True) 
