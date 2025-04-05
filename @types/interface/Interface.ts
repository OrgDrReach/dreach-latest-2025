// Children Prop
export interface RNChildProp {
  children?: React.ReactNode;
}

// Doctor Search
export interface SearchLocationProps {
  onSearch: (query: string) => void;
}

// Search Context
export interface SearchContext {
  query: string;
  setQuery: (query: string) => void;
}

// Filter Dropdown
export interface FilterDropdownProps {
  title: string;
  options: string[];
}
