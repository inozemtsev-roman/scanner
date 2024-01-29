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
		id: 'gift',
		useable: true
	},
	{
		id: 'Unique',
		price: 274.89
	},
	{
		id: 'Rare',
		price: 274.89
	},
	{
		id: 'Uncommon',
		price: 274.89
	},
	{
		id: 'Scarce',
		price: 274.89
	},
	{
		id: 'Amazing',
		price: 183.223
	},
	{
		id: 'Exceptional',
		price: 157.033
	},
	{
		id: 'Unusual',
		price: 99.89
	},
	{
		id: 'Singular',
		price: 84.505
	},
	{
		id: 'Unprecedented',
		price: 54.89
	},
	{
		id: 'Exclusive',
		price: 40.631
	},
	{
		id: 'Precious',
		price: 30.446
	},
	{
		id: 'Distinctive',
		price: 17.923
	},
	{
		id: 'Unmatched',
		price: 11.978
	},
	{
		id: 'Peculiar',
		price: 11.847
	},
	{
		id: 'Exceptionable',
		price: 26.644
	},
	{
		id: 'Curious',
		price: 24.325
	},
	{
		id: 'Abnormal',
		price: 18.228
	},
	{
		id: 'Outstanding',
		price: 16.091
	},
	{
		id: 'Rarefied',
		price: 10.926
	},
	{
		id: 'Remarkable',
		price: 9.613
	},
	{
		id: 'Unparalleled',
		price: 8.977
	},
	{
		id: 'Uncommonplace',
		price: 8.679
	},
	{
		id: 'Unconventional',
		price: 8.089
	},
	{
		id: 'Inimitable',
		price: 6.507
	},
	{
		id: 'Unheard',
		price: 5.148
	},
	{
		id: 'Quirky',
		price: 4.768
	},
	{
		id: 'Specialized',
		price: 4.756
	},
	{
		id: 'Extraordinary',
		price: 4.681
	},
	{
		id: 'Infrequent',
		price: 3.826
	},
	{
		id: 'Common',
		price: 3.809
	}
]

export const items = new Map<string, Item>(itemsData.map((data) => [data.id, new Item(data)]))
