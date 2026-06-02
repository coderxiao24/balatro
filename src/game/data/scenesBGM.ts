import { AudioManager } from "../AudioManager";
import { sceneNames } from "./types/scenesName";
const scenesBGMMap: Record<sceneNames, () => void> = {
    [sceneNames.MainMenu]: () => {
        AudioManager.getInstance().playMusic("MainMenu", "music1", {
            volume: 0.6,
            rate: 0.7,
            fadeIn: 3 * 1000,
        });
    },
    [sceneNames.Boot]: () => {},
    [sceneNames.Game]: () => {},
    [sceneNames.GameOver]: () => {},
    [sceneNames.Preloader]: () => {},
    [sceneNames.Splash]: () => {},
};
export default scenesBGMMap;
