import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AutoComplete, IconButton, Paper } from 'material-ui';
import { ClientStyle as Style } from 'react-css-component';
import SearchIcon from 'material-ui/svg-icons/action/search';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import { grey500 } from 'material-ui/styles/colors';

const getStyles = (props, state) => {
  const { disabled, iconButtonStyle } = props;
  const { value } = state;
  const nonEmpty = value.length > 0;

  return {
    root: {
      height: 48,
      display: 'flex',
      justifyContent: 'space-between',
    },
    iconButtonClose: {
      style: {
        opacity: !disabled ? 0.54 : 0.38,
        transform: nonEmpty ? 'scale(1, 1)' : 'scale(0, 0)',
        transition: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        ...iconButtonStyle,
      },
      iconStyle: {
        opacity: nonEmpty ? 1 : 0,
        transition: 'opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
    },
    iconButtonSearch: {
      style: {
        opacity: !disabled ? 0.54 : 0.38,
        transform: nonEmpty ? 'scale(0, 0)' : 'scale(1, 1)',
        transition: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        marginRight: -48,
        ...iconButtonStyle,
      },
      iconStyle: {
        opacity: nonEmpty ? 0 : 1,
        transition: 'opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
    },
    input: {
      width: '100%',
      webkitAppearance: 'none',
    },
    searchContainer: {
      margin: 'auto 0 0 16px',
      width: '100%',
    },
  };
};

const inlineStyle = `
input[type='search']::-webkit-search-decoration,
input[type='search']::-webkit-search-cancel-button,
input[type='search']::-webkit-search-results-button,
input[type='search']::-webkit-search-results-decoration {
  display: none;
}

input[type='search']::-ms-clear {
  display: none;
}

input[type='search'] {
  -webkit-appearance: none;
}
`;

/**
 * Material design search bar
 * @see [Search patterns](https://material.io/guidelines/patterns/search.html)
 */
export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false,
      value: this.props.value,
      active: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ ...this.state, value: nextProps.value });
    }
  }

  /**
   * Focus the search field.
   * @public
   */
  focus() {
    this.autoComplete.focus();
  }

  /**
   * Blurs the search field.
   * @public
   */
  blur() {
    this.autoComplete.blur();
  }

  handleFocus() {
    this.setState({ focus: true });
  }

  handleBlur() {
    this.setState({ focus: false });
    if (this.state.value.trim().length === 0) {
      this.setState({ value: '' });
    }
  }

  handleInput(e) {
    this.setState({ value: e });
    this.props.onChange(e);
  }

  handleCancel() {
    this.setState({ active: false, value: '' }, () => this.props.onClear());
    this.props.onChange('');
  }

  handleKeyPressed(e) {
    if (e.charCode === 13) {
      e.preventDefault();
      e.target.blur();
      this.props.onRequestSearch(e);
    }
  }

  render() {
    const styles = getStyles(this.props, this.state);
    const { value } = this.state;
    const { closeIcon, disabled, onRequestSearch, searchIcon, style, ...inputProps } = this.props;
    delete inputProps.onClear;
    return (
      <Paper
        style={{
          ...styles.root,
          ...style,
        }}
      >
        <Style css={inlineStyle} />
        <div style={styles.searchContainer}>
          <form action='.'>
            <AutoComplete
              type='search'
              ref={ref => {
                this.autoComplete = ref;
              }}
              onBlur={() => this.handleBlur()}
              searchText={value}
              onUpdateInput={e => this.handleInput(e)}
              onKeyPress={e => this.handleKeyPressed(e)}
              onFocus={() => this.handleFocus()}
              fullWidth
              style={styles.input}
              underlineShow={false}
              disabled={disabled}
              {...inputProps}
            />
          </form>
        </div>
        <IconButton
          onClick={onRequestSearch}
          iconStyle={styles.iconButtonSearch.iconStyle}
          style={styles.iconButtonSearch.style}
          disabled={disabled}
        >
          {searchIcon}
        </IconButton>
        <IconButton
          onClick={() => this.handleCancel()}
          iconStyle={styles.iconButtonClose.iconStyle}
          style={styles.iconButtonClose.style}
          disabled={disabled}
        >
          {closeIcon}
        </IconButton>
      </Paper>
    );
  }
}

SearchBar.defaultProps = {
  closeIcon: <CloseIcon color={grey500} />,
  dataSource: [],
  dataSourceConfig: { text: 'text', value: 'value' },
  disabled: false,
  hintText: 'Search',
  searchIcon: <SearchIcon color={grey500} />,
  value: '',
  onClear: Function(),
};

SearchBar.propTypes = {
  /** Override the close icon. */
  closeIcon: PropTypes.node,
  /** Array of strings or nodes used to populate the list. */
  dataSource: PropTypes.array,
  /** Config for objects list dataSource. */
  dataSourceConfig: PropTypes.object,
  /** Disables text field. */
  disabled: PropTypes.bool,
  /** Sets hintText for the embedded text field. */
  hintText: PropTypes.string,
  /** Override the inline-styles of the button element. */
  iconButtonStyle: PropTypes.object,
  /** Fired when the text value changes. */
  onChange: PropTypes.func.isRequired,
  /** Fired when the clear icon is clicked. */
  onClear: PropTypes.func,
  /** Fired when the search icon is clicked. */
  onRequestSearch: PropTypes.func.isRequired,
  /** Override the search icon. */
  searchIcon: PropTypes.node,
  /** Override the inline-styles of the root element. */
  style: PropTypes.object,
  /** The value of the text field. */
  value: PropTypes.string,
};
