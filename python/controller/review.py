import request.request as req

def add_review(data):
    if (not "attraction_id" in data or not data["attraction_id"]):
        return False
    
    if (not "note" in data or data["note"] is None):
        return False
    
    if (not "commentaire" in data or data["commentaire"] == ""):
        return False

    nom = data.get("nom", "Anonyme") or "Anonyme"
    prenom = data.get("prenom", "Anonyme") or "Anonyme"

    requete = "INSERT INTO review (attraction_id, nom, prenom, note, commentaire) VALUES (?, ?, ?, ?, ?);"
    id = req.insert_in_db(requete, (data["attraction_id"], nom, prenom, data["note"], data["commentaire"]))

    return id

def get_reviews(attraction_id):
    if (not attraction_id):
        return []

    json = req.select_from_db("SELECT * FROM review WHERE attraction_id = ? ORDER BY date_creation DESC", (attraction_id,))

    return json

def get_average_rating(attraction_id):
    if (not attraction_id):
        return {"average": 0, "count": 0}

    result = req.select_from_db("SELECT AVG(note) as average, COUNT(*) as count FROM review WHERE attraction_id = ?", (attraction_id,))
    
    if len(result) > 0 and result[0]["average"] is not None:
        return {"average": round(result[0]["average"], 1), "count": result[0]["count"]}
    return {"average": 0, "count": 0}
