import React, { Fragment } from "react";
import { gql, useQuery } from "@apollo/client";

import { LaunchTile, Header, Button, Loading, LaunchDetail } from "../components";
import { RouteComponentProps } from "@reach/router";
import * as GetLaunchListTypes from "./__generated__/GetLaunchList";
import { ActionButton } from '../containers';
import * as LaunchDetailsTypes from './__generated__/LaunchDetails';



export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`;

const GET_LAUNCHES = gql`
  query launchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {

        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;


interface LaunchesProps extends RouteComponentProps {}

const Launches: React.FC<LaunchesProps> = () => {
  const { data, loading, fetchMore, error } = useQuery<
    GetLaunchListTypes.GetLaunchList,
    GetLaunchListTypes.GetLaunchListVariables
  >(GET_LAUNCHES);

  if (loading) return <Loading />;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  return (
    <Fragment>
      <Header />
      {data.launches &&
        data.launches.launches &&
        data.launches.launches.map((launch: any) => (
          <LaunchTile key={launch.id} launch={launch} />
        ))}

      {data.launches && data.launches.hasMore && (
        <Button
          onClick={() =>
            fetchMore({
              variables: {
                after: data.launches.cursor,
              },
              updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                if (!fetchMoreResult) return prev;
                return {
                  ...fetchMoreResult,
                  launches: {
                    ...fetchMoreResult.launches,
                    launches: [
                      ...prev.launches.launches,
                      ...fetchMoreResult.launches.launches,
                    ],
                  },
                };
              },
            })
          }
        >
          Load More
        </Button>
      )}
    </Fragment>
  );
};

export default Launches;

// export const LAUNCH_TILE_DATA = gql`
//   fragment LaunchTile on Launch {
//     __typename
//     id
//     isBooked
//     rocket {
//       id
//       name
//     }
//     mission {
//       name
//       missionPatch
//     }
//   }
// `;



interface LaunchesProps extends RouteComponentProps {}

// const Launches: React.FC<LaunchesProps> = () => {
//   return <div />;
// }

// export default Launches;
