export enum MessageScope {
    Storyteller = 1 << 0,
    SetDifficulty = 1 << 1,
    ReloadCharacters = 1 << 2,
    ChangeCharacter = 1 << 3,
    AddExperience = 1 << 4,
    DecreaseExperience = 1 << 5,
    SetHunger = 1 << 6,
    ReRoll = 1 << 7,
    DicePool = 1 << 8
}