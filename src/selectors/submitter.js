const instanceTypeDescriptions = state =>
  state.submitter.instanceTypes.map(_ => _.description);
const instanceTypeNames = state =>
  state.submitter.instanceTypes.map(_ => _.name);

export { instanceTypeDescriptions, instanceTypeNames };
