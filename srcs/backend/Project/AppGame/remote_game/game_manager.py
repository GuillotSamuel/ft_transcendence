from .game_state import Game

class GameManager:
    games = {}

    @classmethod
    def get_game(cls, match_uuid, channel_layer):
        if match_uuid not in cls.games:
            cls.games[match_uuid] = Game(match_uuid, channel_layer)
        return cls.games[match_uuid]

    @classmethod
    def remove_game(cls, match_uuid):
        if match_uuid in cls.games:
            del cls.games[match_uuid]
