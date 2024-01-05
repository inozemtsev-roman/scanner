enum ItemRarity {
	Common = 'common',
	Uncommon = 'uncommon',
	Rare = 'rare',
	VeryRare = 'veryRare',
	Epic = 'epic',
	Legendary = 'legendary'
}

interface ItemData {
	id: string
	rarity?: ItemRarity
	price?: number
	useable?: boolean
}

export class Item {
	id: string
	rarity: ItemRarity
	price: number
	usable: boolean

	constructor(data: ItemData) {
		this.id = data.id
		this.rarity = data.rarity ?? ItemRarity.Common
		this.price = data.price ?? 0
		this.usable = data.useable ?? false
	}

	get sellable() {
		return Boolean(this.price)
	}
}

const itemsData: ItemData[] = [
	{
		id: 'envelope',
		useable: true
	},
	{
		id: 'Unique',
		price: 25
	},
	{
		id: 'Rare',
		price: 25
	},
	{
		id: 'Uncommon',
		price: 25
	},
	{
		id: 'Scarce',
		price: 25
	},
	{
		id: 'Amazing',
		price: 25
	},
	{
		id: 'Exceptional',
		price: 25
	},
	{
		id: 'Unusual',
		price: 25
	},
	{
		id: 'Singular',
		price: 25
	},
	{
		id: 'Unprecedented',
		price: 25
	},
	{
		id: 'Exclusive',
		price: 25
	},
	{
		id: 'Precious',
		price: 25
	},
	{
		id: 'Distinctive',
		price: 25
	},
	{
		id: 'Unmatched',
		price: 25
	},
	{
		id: 'Peculiar',
		price: 25
	},
	{
		id: 'Exceptionable',
		price: 25
	},
	{
		id: 'Curious',
		price: 25
	},
	{
		id: 'Abnormal',
		price: 25
	},
	{
		id: 'Outstanding',
		price: 25
	},
	{
		id: 'Rarefied',
		price: 25
	},
	{
		id: 'Remarkable',
		price: 25
	},
	{
		id: 'Unparalleled',
		price: 25
	},
	{
		id: 'Uncommonplace',
		price: 25
	},
	{
		id: 'Unconventional',
		price: 25
	},
	{
		id: 'Inimitable',
		price: 25
	},
	{
		id: 'Unheard',
		price: 25
	},
	{
		id: 'Quirky',
		price: 25
	},
	{
		id: 'Specialized',
		price: 25
	},
	{
		id: 'Extraordinary',
		price: 25
	},
	{
		id: 'Infrequent',
		price: 25
	},
	{
		id: 'Common',
		price: 25
	}
]

export const items = new Map<string, Item>(itemsData.map((data) => [data.id, new Item(data)]))
