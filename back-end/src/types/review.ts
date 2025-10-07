export interface Review {
    id: number;
    grade: number;
    comment?: string;
    userId: number;
    recipeId: number;
}

