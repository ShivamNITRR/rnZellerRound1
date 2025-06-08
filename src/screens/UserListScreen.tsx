import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, ListRenderItem, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import UserCard from '../components/UserCard';
import { Role, ZellerCustomer, ZellerCustomerFilterInput } from '../graphql/types';
import { AppStringConstants, RoleLabels, roles, SEARCH_DEBOUNCE_TIME, TestIDs } from '../Constants/AppConstants';
import colors from '../Constants/colors';
import SearchBar from '../components/SearchBar';
import { debounce, normalizeToRole } from '../utils';
import { useApolloClient } from '@apollo/client';
import { fetchZellerCustomers } from '../APIHelper';
import EmptyView from '../components/EmptyView';
import spacing from '../Constants/spacing';
import { TextStyle } from '../Constants/CommonStyles';
import Section from '../components/Section';
import RadioButtonListView from '../components/RadioButtonListView';

const ITEMS_PER_PAGE = 15;
/*
 * User list screens is dynamic which supports following features
 * 1:- pull to refresh
 * 2:- pagination for large set of list to improve performance
 * 3:- search by user name from graphql with pagination on search supported
 * 4:- search by userType
 * 5:- to clear selected userType filter to all available render list with pagination support
 * 6:- Debouncing feature implemented on search to reduce api all to minimise costing and improve performance
 * 7:- using reusable components
 * 8:- separate logic and ui part
 * 9:- empty list view if no result found for searched text
 * 10:-loading indicator while fetching data
 * 11:- no extra api call
 * NOTE:- not implementing app navigation as it seems to be of no use in current useCase
 */
const UserListScreen = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [nextTokenState, setNextTokenState] = useState<string | null>(null);
  const [currentVisibleUsers, setAllCurrentVisibleUsers] = useState<ZellerCustomer[]>([]);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const client = useApolloClient();
  const [isLoading, setIsLoading] = useState(false);

  const filter = useMemo<ZellerCustomerFilterInput | undefined>(() => {
    let baseFilter: any = {};

    if (selectedRole) {
      const normalizedRole = normalizeToRole(selectedRole);
      baseFilter.role = { eq: normalizedRole };
    }

    if (debouncedSearchText) {
      baseFilter.name = { contains: debouncedSearchText };
    }

    return Object.keys(baseFilter).length > 0 ? baseFilter : undefined;
  }, [selectedRole, debouncedSearchText]);


  const loadUsers = useCallback(
    async (nextTokenParam?: string, append = false) => {
      try {
        if (!append) {
          setIsLoading(true);
        }
        const response = await fetchZellerCustomers(client, filter, ITEMS_PER_PAGE, nextTokenParam);
        const newItems = response?.items || [];

        setNextTokenState(response?.nextToken || null);

        setAllCurrentVisibleUsers(prev =>
          append ? [...prev, ...newItems] : newItems
        );
      } catch (error) {
        console.error('loadUsers error:', error);
      } finally {
        setIsLoading(false);
        setRefreshing(false);
        setIsFetchingMore(false);
      }
    },
    [client, filter]
  );

  const handleFetchMore = () => {
    if (nextTokenState && !isFetchingMore) {
      setIsFetchingMore(true);
      loadUsers(nextTokenState, true);
    }
  };

  const onRefresh = () => {
    if (!refreshing) {
      setRefreshing(true);
      loadUsers('', false);
    }
  };

  const handleSearchInput = useCallback((text: string) => {
    setDebouncedSearchText(text);
  }, []);

  const debouncedSearch = useMemo(() => debounce(handleSearchInput, SEARCH_DEBOUNCE_TIME), [handleSearchInput]);

  useEffect(() => {
    const trimmedText = searchText.trim();
    debouncedSearch(trimmedText);

    return () => {
      debouncedSearch.cancel(); // cancel previous debounce if dependencies change
    };
  }, [searchText, debouncedSearch]);

  useEffect(() => {
    setAllCurrentVisibleUsers([]);
    setNextTokenState(null);
    loadUsers('', false); // Load first page fresh every time either role changes or user searches for new input
  }, [loadUsers, selectedRole, debouncedSearchText]);

  useEffect(() => {
    setSearchText('');  // Reset search on role change
  }, [selectedRole]);

  const onClearAllFilter = () => {
    setSelectedRole(null);
  }
  const renderItem: ListRenderItem<ZellerCustomer> = ({ item }) => {
    return <View style={styles.flatlistItemContainer}>
      <UserCard user={item} />
    </View>;
  };

  return (
    <View style={styles.container}>

      <Section title="User Types">
        <View style={styles.radioListContainer}>
          <RadioButtonListView
            options={roles}
            selected={selectedRole}
            onSelect={setSelectedRole}
            getLabel={item => RoleLabels[item]}
            getValue={item => item}
          />
        </View>
        {selectedRole ? <TouchableOpacity onPress={onClearAllFilter} style={styles.clearFilterButton}>
          <Text style={{ ...TextStyle.text_16_bold, color: colors.blue }}>{AppStringConstants.CLEAR_SELECTION}</Text>
        </TouchableOpacity>
          : null}
      </Section>

      <Section title={selectedRole ? `${RoleLabels[selectedRole]} Users` : 'All Users'} containerStyle={styles.subContainer}>
        <SearchBar testID={TestIDs.SEARCH_BAR_TEST_ID} value={searchText} onChangeText={setSearchText} containerStyle={styles.searchBoxContainerStyle} />
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.blue} style={styles.loaderStyle} testID={TestIDs.MAIN_LOADER_TEST_ID}/>
        ) : (
          <FlatList
            testID={TestIDs.FLATLIST_TEST_ID}
            data={currentVisibleUsers}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            onRefresh={onRefresh}
            initialNumToRender={10}
            maxToRenderPerBatch={5}
            refreshing={refreshing}
            onEndReached={handleFetchMore}
            onEndReachedThreshold={0.01}
            ListFooterComponent={
              isFetchingMore ? <ActivityIndicator testID={TestIDs.FOOTER_LOADER_TEST_ID} size="large" color={colors.blue} /> : null
            }
            ListEmptyComponent={(!isLoading && !!searchText?.trim?.() && !currentVisibleUsers.length) ? <EmptyView searchText={searchText?.trim?.()} /> : null}
          />
        )}
      </Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.spacing24,
    backgroundColor: colors.white,
  },
  subContainer: {
    flex: 1,
  },
  radioListContainer: {
    marginTop: spacing.spacing16,
  },
  sectionTitle: {
    ...TextStyle.text_20_bold,
    marginVertical: spacing.spacing12,
  },
  flatlistItemContainer: {
    paddingVertical: spacing.spacing12,
  },
  searchBoxContainerStyle: {
    marginVertical: spacing.spacing16,
  },
  clearFilterButton: {
    backgroundColor: colors.lightBlue,
    borderRadius: 24,
    paddingVertical: spacing.spacing8,
    paddingHorizontal: spacing.spacing16,
    marginVertical: spacing.spacing8,
    alignSelf: 'center',
  },
  loaderStyle: {
    alignSelf: 'center',
    marginTop: spacing.spacing32,
  },
});

export default UserListScreen;
