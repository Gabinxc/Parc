export interface ReviewInterface {
    review_id: number | null;
    attraction_id: number;
    nom: string;
    prenom: string;
    note: number;
    commentaire: string;
    date_creation: string;
}

export interface ReviewAverageInterface {
    average: number;
    count: number;
}
