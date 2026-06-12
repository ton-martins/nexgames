import amongUsImage from "../Assets/images/among_us.png";
import heroLegendImage from "../Assets/images/a_lenda_do_heroi.png";
import bloodborneImage from "../Assets/images/bloodborne.png";
import cyberpunk2077Image from "../Assets/images/cyberpunk_2077.png";
import enigmaDoMedoImage from "../Assets/images/enigma_do_medo.png";
import fallout4Image from "../Assets/images/fallout_4.png";
import grandTheftAutoVImage from "../Assets/images/grand_theft_auto_v.png";
import horizonZeroDawnImage from "../Assets/images/horizon_zero_dawn.png";
import monsterHunterWorldImage from "../Assets/images/monster_hunter_world.png";
import persona5RoyalImage from "../Assets/images/persona_5_royal.png";
import portal2Image from "../Assets/images/portal_2.png";
import redDeadRedemption2Image from "../Assets/images/red_dead_redemption_2.png";
import residentEvil7Image from "../Assets/images/resident_evil_7_biohazard.png";
import sekiroImage from "../Assets/images/sekiro_shadows_die_twice.png";
import stardewValleyImage from "../Assets/images/stardew_valley.png";
import skyrimImage from "../Assets/images/the_elder_scrolls_v_skyrim.png";
import zeldaImage from "../Assets/images/the_legend_of_zelda.png";
import witcher3Image from "../Assets/images/the_witcher_3_wild_hunt.png";

const GAME_IMAGE_BY_ID = {
	1: zeldaImage,
	3: stardewValleyImage,
	4: portal2Image,
	5: redDeadRedemption2Image,
	7: cyberpunk2077Image,
	8: amongUsImage,
	9: heroLegendImage,
	10: enigmaDoMedoImage,
	11: bloodborneImage,
	13: horizonZeroDawnImage,
	14: sekiroImage,
	15: skyrimImage,
	16: residentEvil7Image,
	17: fallout4Image,
	18: monsterHunterWorldImage,
	20: witcher3Image,
	21: grandTheftAutoVImage,
	22: persona5RoyalImage,
};

const GAME_IMAGE_BY_NAME = {
	"the legend of zelda breath of the wild": zeldaImage,
	"stardew valley": stardewValleyImage,
	"portal 2": portal2Image,
	"red dead redemption 2": redDeadRedemption2Image,
	"cyberpunk 2077": cyberpunk2077Image,
	"among us": amongUsImage,
	"a lenda do heroi": heroLegendImage,
	"enigma do medo": enigmaDoMedoImage,
	"bloodborne": bloodborneImage,
	"horizon zero dawn": horizonZeroDawnImage,
	"sekiro shadows die twice": sekiroImage,
	"the elder scrolls v skyrim": skyrimImage,
	"resident evil 7 biohazard": residentEvil7Image,
	"fallout 4": fallout4Image,
	"monster hunter world": monsterHunterWorldImage,
	"the witcher 3 wild hunt": witcher3Image,
	"grand theft auto v": grandTheftAutoVImage,
	"persona 5 royal": persona5RoyalImage,
};

function normalizeGameName(name) {
	return String(name ?? "")
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, " ")
		.trim();
}

export function getGameImageById(gameId) {
	const normalizedId = Number(gameId);

	if (!Number.isInteger(normalizedId)) {
		return null;
	}

	return GAME_IMAGE_BY_ID[normalizedId] ?? null;
}

export function getGameImage(game) {
	if (!game) {
		return null;
	}

	return (
		getGameImageById(game.id) ??
		GAME_IMAGE_BY_NAME[normalizeGameName(game.nome)] ??
		null
	);
}

export function attachGameImage(game) {
	if (!game) {
		return null;
	}

	return {
		...game,
		image: getGameImage(game),
	};
}
