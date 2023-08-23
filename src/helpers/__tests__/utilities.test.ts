import { getCidHash } from '../utilities.ts';

describe('getCidHash', () => {
  const cidV0 = 'Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu';
  const cidV1 = 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi';

  test.each([
    // handle V0 CID
    [cidV0, cidV0],
    [`https://${cidV0}/file.json`, `https://${cidV0}/file.json`],
    [`ipfs://ipfs/${cidV0}`, cidV0],
    [`ipfs://${cidV0}`, cidV0],
    [`/ipfs/${cidV0}`, cidV0],

    // handle V1 CID
    [cidV1, cidV1],
    [`https://${cidV1}/file.json`, `https://${cidV1}/file.json`],
    [`ipfs://ipfs/${cidV1}`, cidV1],
    [`ipfs://${cidV1}`, cidV1],
    [`/ipfs/${cidV1}`, cidV1],
  ])('given %p returns %p', (cid, expectedResult) => {
    const result = getCidHash(cid);

    expect(result).toEqual(expectedResult);
  });
});
